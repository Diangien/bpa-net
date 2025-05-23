/* eslint-disable react-hooks/exhaustive-deps */
import Skeleton from "react-loading-skeleton";

import { LevantamentoType } from "@/types/commons";
import { BiMoneyWithdraw } from "react-icons/bi";
import { useEffect, useState } from "react";
import api from "@/utils/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { formatarData, formatarKz } from "@/constants/modules";

interface Props {
  idConta: number;
  setListaLevantamentos: (levantamentos: LevantamentoType[]) => void;
  listaLevantamentos: LevantamentoType[];
}

export default function LevantamentosList({ idConta }: Props) {
  const [listaLevantamentos, setListaLevantamentos] = useState<LevantamentoType[]>();
  useEffect(() => {
    async function getAllProducts() {
      try {
        const levantamentosRecentes = await api.get(`/trasacao/levantamentos/${idConta}`);
        console.log(levantamentosRecentes.data.Levantamentos);

        setListaLevantamentos(levantamentosRecentes.data.Levantamentos);
        //setl(levantamentosRecentes.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 400) {
            toast.error(error.response?.data.message);
          } else {
            toast.error("Sem conexão com o servidor" + error);
          }
        }
      }
    }

    getAllProducts();
  }, []);


  return (
    <>
      {!listaLevantamentos && (
        <>
          <Skeleton borderRadius={10} height={50} style={{ width: "100%" }} />
          <Skeleton borderRadius={10} height={50} style={{ width: "100%" }} />
          <Skeleton borderRadius={10} height={50} style={{ width: "100%" }} />
        </>
      )}

      {listaLevantamentos && listaLevantamentos.length === 0 && (
        <div className="withoutTransactions">Sem levantamentos</div>
      )}

      {listaLevantamentos &&
        listaLevantamentos.length > 0 &&
        listaLevantamentos.map((levantamento) => (
          <button
            key={levantamento.data}
            type="button"
            className="cardDashboardTransaction flex justify-between w-full p-2 py-3 items-center"
            style={{ border: "none", borderBottom: "1px solid #efefef", borderRadius: "0px" }}
          >
            <div
              className="iconContainer p-1"
              style={{
                backgroundColor: "rgb(219 0 0 / 10%)",
                borderRadius: "6px",
              }}
            >
              <BiMoneyWithdraw
                style={{
                  fill: "#01af23",
                  width: "30px",
                  height: "30px",
                }}
              />
            </div>
            <p style={{ fontWeight: "600" }}>{formatarKz(levantamento.valor)}</p>
            <p>{formatarData(levantamento.data)}</p>
          </button>
        ))}

      {/*isOpen && (
				<Modal isOpen={isOpen} onClose={()=>{
          onClose()
          }} placement="top-center">
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1">Levantamento sem Cartão
              </ModalHeader>
              <ModalBody>
                  <Input
                    autoFocus
                    label="Descrição do Emissor"
                    type="text"
                    variant="flat"
                    value={upData.transfers.emissor_description}
                    disabled
                  />
                  <Input
                    autoFocus
                    label="NIB do Emissor"
                    type="text"
                    variant="flat"
                    value={upData.accountFrom}
                    disabled
                  />
                  <Input
                    label="Montante"
                    type="text"
                    variant="flat"
                    value={useUtils.formatBalance(upData.balance)}
                    disabled
                  />
                  <Input
                    label="Data de validade"
                    type="text"
                    variant="flat"
                    disabled
                    value={useUtils.addOneDay(upData.date)}
                  />
                  <Input
                    label="Estado do levantamento"
                    type="text"
                    variant="flat"
                    disabled
                    value={upData.status === 1 ? "Pendente" : upData.status === 2 ? "Finalizado" : upData.status === 3 ? "Cancelado" : "Expirado"}
                  />
              </ModalBody>
              <ModalFooter>
              
                <Button variant="flat" color="danger" disabled={loading} onPress={async ()=>{
                  setLoading(true)
                  const resp = await api.put(`/cancelUpmoney/${upData.transferId}`)
                  if (resp.data.success) {
                    toast.success("Levantamento cancelado com sucesso!")
                    useAccount.updateAuthorizedBalance(resp.data.balance.authorized_balance)
                    useAccount.updateAvailableBalance(resp.data.balance.available_balance)
                    useAccount.updateUpBalance(resp.data.balance.up_balance)
                    setUpmoneyList({success: true, data: resp.data.upmoneyList})
                    onClose()
                  }
                  else {
                    toast.error("Falha ao cancelar levantamento!")
                  }
                  setLoading(false)
                }}>{loading ? (
                  <TailSpin
                  height="25"
                  width="25"
                  color="#f00"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  visible={true}
                  />
                ) : (
                  'Cancelar levantamento'
                )}</Button>
                <Button color="default" variant="flat" onPress={onClose}>
                  Fechar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
			)*/}
    </>
  );
}
