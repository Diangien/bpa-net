// app/depositos/page.tsx
"use client"

import { useState, useEffect } from "react"
import {
  Calculator,
  FileText,
  Plus
} from "lucide-react"
import Cabecalho from '@/components/Cabecalho'
import contaStore from "@/contexts/contaStore"
// import InfoError from "@/components/InfoError";
import "@/styles/email_verification.css";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import api from "@/utils/axios"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { FaArrowRightLong } from "react-icons/fa6"
import { TailSpin } from "react-loader-spinner"
import ValidacaoModal from "@/components/modals/ValidacaoModal";
import ConfirmacaoModal from "@/components/modals/ConfirmacaoModal";
import { formataSaldo } from "@/constants/modules";
// Atualize a interface para incluir as propriedades dinâmicas usadas no simulador
interface IDeposito {
  n_idtipodeposito: number;
  t_nome: string;
  t_descricao: string;
  n_tanb: string;    // ex: "10.00%"
  n_prazo: string;   // ex: "30 Dias"
  n_montanteMin: number;
}

export default function DepositosPage() {

  const conta = contaStore()
  const [valorSimulacao, setValorSimulacao] = useState("")
  const [modalidade, setModalidade] = useState("DP BPA 10%")
  const [selectedDeposit, setSelectedDeposit] = useState<IDeposito | null>(null)
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [otp, setOtp] = useState("");
   const [dadosForm, setDadosForm] = useState<depositoSchema>() 
  const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure();
  const { isOpen: isOpen3, onOpen: onOpen3, onClose: onClose3 } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
  const [resultadoSimulacao, setResultadoSimulacao] = useState({
    jurosBrutos: "0 Kz",
    retencao: "0 Kz",
    jurosLiquidos: "0 Kz",
    poupancaLiquida: "0 Kz"
  })
 
   const depositoSchema = z.object({
      valor: z.string(),
    });
      type depositoSchema = z.infer<typeof depositoSchema>;
      const { register, handleSubmit,watch } = useForm<depositoSchema>({
        resolver: zodResolver(depositoSchema),
      });
    
  // Novo estado para os depósitos da API
  const [depositos, setDepositos] = useState<IDeposito[]>([])
  const montante = parseInt(watch("valor"));

  // Buscar os dados da API ao carregar o componente
  useEffect(() => {
    const fetchDepositos = async () => {
      try {
        const response = await api.get("/deposito/listar")
        // A API retorna um objeto com propriedade "dados"
        setDepositos(response.data.dados)
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 400) {
            toast.error(error.response?.data.message);
          } else {
            toast.error("Sem conexão com o servidor");
          }
        }
      }
    }
    fetchDepositos()
  }, [])
  // Atualiza o selectedDeposit assim que o usuário alterar a modalidade
  useEffect(() => {
    const deposit = depositos.find(dep => dep.t_nome === modalidade) ?? null;
    setSelectedDeposit(deposit);
  }, [modalidade, depositos]);


  async function confirmarDeposito(data: depositoSchema) {
    setDadosForm(data);
    onOpen2();
  }
    async function handledeposito(otp: string) {
      try {
        if(otp.length <6) return;
              setIsLoading(true);
        
               const result = await api.post(`/trasacao/verificacodigo`,{codigo2fa:otp})
               console.log(result);
        setIsLoadingModal(true);
        const dataset = {
          idconta:conta.id,
          iddeposito:selectedDeposit?.n_idtipodeposito,
          ...dadosForm,
        };
  
        //console.log(dadoadd)
   
        const response = await api.post('/deposito/depositar', dataset);
  
        conta.setSaldo(Number(response.data.saldoactualizado));
         onClose3();
         onClose();
        toast.success(response.data.message, {
          action: {
            label: "Comprovativo",
            onClick: async () =>
              window.open(
                `http://localhost:5000/pdf/comprovativo/${response.data.idtransacao}`,
                "_blank"
              ),
          },
        });
      } catch (erro) {
        if (erro instanceof AxiosError) {
          if (erro.response?.status === 400) {
            toast.error(erro.response?.data.message);
          } else {
            toast.error("Sem conexão com o servidor");
          }
        }
      } finally {
        setIsLoadingModal(false);
      }
    }

  // Atualize a função simular para usar os valores dinâmicos do depósito selecionado
  const simular = () => {
    const valor = parseFloat(valorSimulacao.replace(/[^0-9]/g, ""))
    if (isNaN(valor)) return

    // Buscar o depósito selecionado com base na modalidade escolhida


    // Check if selectedDeposit is available
    if (!selectedDeposit) return;
    // Converter TANB e prazo para valores numéricos
    const tanb = parseFloat(selectedDeposit.n_tanb.replace('%', '').trim().replace(',', '.'))
    const prazoDias = parseInt(selectedDeposit.n_prazo.replace(/\D/g, ''))

    const jurosBrutos = Number((valor * (tanb / 100) * (prazoDias / 365)).toFixed(2))
    const imposto = Number((jurosBrutos * 0.10).toFixed(2))
    const jurosLiquidos = Number((jurosBrutos - imposto).toFixed(2))
    const poupancaLiquida = Number((valor + jurosLiquidos).toFixed(2))

    setResultadoSimulacao({
      jurosBrutos: `${jurosBrutos} Kz`,
      retencao: `${imposto} Kz`,
      jurosLiquidos: `${jurosLiquidos} Kz`,
      poupancaLiquida: `${poupancaLiquida} Kz`
    })
  }

  return (
    <div>
      <Cabecalho Titulo='Despositos' subTitulo='Aplicações de depositos a prazo' />
    <div className="bg-gray-100 rounded-xl container mx-auto p-5">
      <div className="flex flex-col space-y-4 ">
        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Área dos Cards dinâmicos */}
          <div className="lg:col-span-2 space-y-6 ">
            {depositos.map(deposito => (
              <Card key={deposito.n_idtipodeposito}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-blue-600">{deposito.t_nome}</h3>
                    <p className="text-gray-600">
                      {deposito.t_descricao}
                    </p>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Ficha técnica
                      </Button>
                      <Button onClick={() => {
                        setModalidade(deposito.t_nome);
                        onOpen();
                      }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Constituir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Simulador */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-gray-700 mb-1">Simulador</CardTitle>
              <Separator />
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Modalidade de DP</label>
                <Select
                  value={modalidade}
                  onValueChange={setModalidade}
                >
                  <SelectTrigger className="p-5">
                    <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {depositos.map(deposito => (
                      <SelectItem key={deposito.n_idtipodeposito} value={deposito.t_nome}>
                        {deposito.t_nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-800">TANB</label>
                <p className="text-lg font-medium text-gray-600">
                  {`${selectedDeposit?.n_tanb}`}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium  text-gray-800">Montante Mínimo</label>
                <p className="text-lg font-semibold text-gray-700">{selectedDeposit?.n_montanteMin.toString()}</p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium  text-gray-800">Montante Máximo</label>
                <p className="text-lg font-semibold text-gray-700">Não aplicavel</p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="bg-gray-100 px-2 py-1 rounded">Kz</div>
                <Input
                  placeholder="Digite o valor"
                  value={valorSimulacao}
                  onChange={(e) => setValorSimulacao(e.target.value)}
                />
              </div>

              <Button
                className="w-full bg-blue-500 "
                onClick={simular}
              >
                <Calculator className="mr-2 h-4 w-4" />
                Simular
              </Button>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Juros brutos</span>
                  <span className="font-medium text-gray-700">{resultadoSimulacao.jurosBrutos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Retenção</span>
                  <span className="font-medium text-gray-700">{resultadoSimulacao.retencao}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Juros líquidos</span>
                  <span className="font-medium text-gray-700">{resultadoSimulacao.jurosLiquidos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Poupança líquida</span>
                  <span className="font-medium text-gray-700">{resultadoSimulacao.poupancaLiquida}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        size={"lg"}
        onClose={onClose}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        backdrop="blur"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col ">Aplicação de Deposito A prazo</ModalHeader>
            
              <ModalBody className="mt-0">
               
                <form onSubmit={handleSubmit(confirmarDeposito)}>

                  <div className="input_field">
                    <label htmlFor="name">Produto </label>
                    <input
                      type="text"
                      disabled
                      value={selectedDeposit?.t_nome}

                    />
                    {/* {errors.nomeCliente && <InfoError message={errors.nomeCliente.message} />} */}
                  </div>

                  <div className="input_field">
                    <label htmlFor="name">Taxa Anual Nominal Bruta </label>
                    <input
                      type="text"
                      disabled
                      value={selectedDeposit?.n_tanb}

                    />
                    {/* {errors.nomeCliente && <InfoError message={errors.nomeCliente.message} />} */}
                  </div>

                  <div className="input_field">
                    <label htmlFor="name">Prazo</label>
                    <input
                      type="text"
                      disabled
                      value={selectedDeposit?.n_prazo}

                    />
                    {/* {errors.nomeCliente && <InfoError message={errors.nomeCliente.message} />} */}
                  </div>
                 
                  <div className="input_field">
                    <label htmlFor="name">Montante minimo </label>
                    <input
                      type="text"
                      disabled
                      value={selectedDeposit?.n_montanteMin.toString()}

                    />
                    {/* {errors.nomeCliente && <InfoError message={errors.nomeCliente.message} />} */}
                  </div>
                  <div className="input_field">
                    <label htmlFor="name">Muntante a Aplicar</label>
                    <input
                      type="text"
                     placeholder="Digite o montante a aplicar" 
                     {...register("valor")}         

                    />
                    {/* {errors.nomeCliente && <InfoError message={errors.nomeCliente.message} />} */}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoadingModal}
                    className="button_auth"
                  >
                    {isLoadingModal ? (
                      <TailSpin
                        height="25"
                        width="25"
                        color="#fff"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        visible={true}
                      />
                    ) : (
                      <>
                        Aplicar <FaArrowRightLong style={{ marginLeft: "10px" }} />
                      </>
                    )}
                  </button>
                  <div className="terms">


                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
       <ConfirmacaoModal
                    isOpen={isOpen2}
                    onClose={onClose2}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    onOpen2={onOpen3}
                    title="Confirme os dados do Deposito"
                    dados={[
                      {key:"Modadalidade", value:selectedDeposit?.t_nome || ""},
                      {key:"Prazo", value:selectedDeposit?.n_prazo || ""},
                      {key:"Montante a aplicar", value:`${formataSaldo(montante)} Kz`}
                    ]}
                  />
                <ValidacaoModal
                    isOpen={isOpen3}
                    onClose={onClose3}
                    otp={otp}
                    setOtp={setOtp}
                    isLoading={isLoading}
                    handleFunction={handledeposito}
                  />
    </div>
    </div>
  )
}
