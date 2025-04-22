'use client'
import { useState, useEffect } from 'react';
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale/pt-BR";
import { toast } from "sonner";
import api from "@/utils/axios";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button"
import Cabecalho from '@/components/Cabecalho'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  CalendarIcon,
  Download,
  MoreVertical,
  Check,
  ArrowDown,
  Plus,
  ArrowUp
} from 'lucide-react';
import { Avatar, AvatarIcon } from '@nextui-org/react';
import GuideDriver from "@/components/Guia";
// Definição de tipos
interface Transaction {
  id: number;
  Descricao: string;
  data: string;
  debito: string | null;
  credtio: string | null;
  saldoactual: string | null
}

interface TransactionGroup {
  date: string;
  transactions: Transaction[];
}

export default function TransactionsPage() {
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [datafim, setDatafim] = useState<Date | undefined>(undefined);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

    const TransacoesSteps = [
      { element: '.inicial', popover: { title: 'Tela de Trasações', description: 'Esta Página  permite você visualizar todas as movimentações realizadas em sua conta  Vamos Guia-lo' } },
      { element: '.trasacao', popover: { title: 'Visualização de Transações', description: 'Aqui, a tela exibe uma lista detalhada das transações realizadas, incluindo: A data da transação, O tipo de transação , O montante movimentado, E o saldo após cada movimento' } },
      { element: '.personalizar', popover: { title: 'Personalização da Consulta', description: 'Para facilitar a busca por transações específicas, o você pode personalizar sua consulta definindo  Data de Início e Data de Fim'} },
      { element: '.aplicar', popover: { title: 'Personalização da Consulta', description: 'Clique aqui para exibir os dados da sua consulta' } },
      { element: '.pdf', popover: { title: 'Geração de Extrato', description: 'Se o você precisar de um extrato das suas transações,  pode gerar um arquivo PDF clicando neste botão' } },
    ]
    const [showGuide, setShowGuide] = useState(false);
    // Inicializa o driver mas adia o drive() até ter certeza que o elemento existe
    useEffect( () => {
      // Aguarda até que o elemento ".pessoa" esteja presente na DOM
      if (localStorage.getItem('primeiroLogin') == 'true') {
        // Executa o driver
        if(!localStorage.getItem('GuiaTrasacaoeE')) {
          // Executa o driver
          setTimeout(() => setShowGuide(true), 200);
          }	
      }
    }, []);
  // Função para buscar os dados da API
  const fetchTransactions = async (): Promise<void> => {
    try {
      setLoading(true);
  

      api.get(`/trasacao/trasacoesrecentes/${Number(localStorage.getItem("idConta"))}`)
        .then(response => {
          const dados = response.data.trasacoes;
          setTransactions(dados);
        })
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          toast.error(error.response?.data.message);
        } else {
          toast.error("Sem conexão com o servidor");
        }
      }

    } finally {
      setLoading(false);
    }
  };

  const buscarTrasacoesFiltradas = async (): Promise<void> => {
    try {
      const DataInicio = dataInicio ? format(dataInicio, "yyyy-MM-dd") : "";
      const DataFim = datafim ? format(datafim, "yyyy-MM-dd") : "";
      setLoading(true);
      api.get(`/trasacao/gettrasacao/${Number(localStorage.getItem("idConta"))}/${DataInicio}/${DataFim}`)
        .then(response => {
          const dados = response.data.trasacoes;
          setTransactions(dados);
        })

    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          toast.error(error.response?.data.message);
        } else {
          toast.error("Sem conexão com o servidor");
        }
      }
    } finally {
      setLoading(false);
    }
  }
  const CriarPdf = async (): Promise<void> => {
    const DataInicio = dataInicio ? format(dataInicio, "yyyy-MM-dd") : "";
    const DataFim = datafim ? format(datafim, "yyyy-MM-dd") : "";
    window.open(`http://localhost:5000/pdf/extrato/${Number(localStorage.getItem("idConta"))}/${DataInicio}/${DataFim}`, '_blank')
  }


  // Executar a busca quando o componente for montado
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Função para aplicar filtros de data
  const handleApplyFilters = (): void => {
    buscarTrasacoesFiltradas();
  };
  const GeraPdf = (): void => {
    CriarPdf();
  };

  // Agrupar transações por data
  const groupTransactionsByDate = (): TransactionGroup[] => {
    const groups: Record<string, Transaction[]> = {};

    transactions.forEach(transaction => {
      const date = transaction.data;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
    });


    // Ordenar as datas em ordem decrescente (mais recentes primeiro)
    return Object.keys(groups)
      .map(date => ({
        date,
        transactions: groups[date]
      }));
  };

  // Formatar a data para exibição (ex: "5 Fevereiro")
  const formatDateHeader = (dateString: string): string => {
    try {
      // Verificar se a string de data está no formato correto
      if (!dateString || !/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
        console.error('Formato de data inválido:', dateString);
        return 'Data inválida';
      }

      const date = parseISO(dateString);

      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        console.error('Data inválida após parseISO:', dateString);
        return 'Data inválida';
      }

      return format(date, "d MMMM", { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };




  const transactionGroups = groupTransactionsByDate();

  return (
    <div>
      <Cabecalho Titulo='Transações' subTitulo='Gira a suas Transações em qualquer momento' />
      <div className='bg-gray-100 p-5 rounded-xl'>
        <div className="max-w-6xl mx-auto p-4 font-sans bg-white rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className=" flex flex-col md:flex-row gap-4 personalizar ">

              <div>
                <label className="text-sm text-gray-600 block mb-1">Data de Início</label>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !dataInicio && "text-muted-foreground"
                        )}
                      >
                        {dataInicio ? format(dataInicio, "yyyy-MM-dd") : <span>Data Inicio</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dataInicio}
                        onSelect={setDataInicio}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">Data de Fim</label>

                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !datafim && "text-muted-foreground"
                        )}
                      >
                        {datafim ? format(datafim, "yyyy-MM-dd") : <span>Data Fim</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={datafim}
                        onSelect={setDatafim}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>

                </div>
              </div>
             
              <button
                onClick={handleApplyFilters}
                className="aplicar mt-6 flex items-center gap-2 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-md"
              >
                <Check className="w-4 h-4" />
                <span>Aplicar</span>
              </button>
            </div>

            <div className="flex gap-2 pdf">
              <button
                onClick={GeraPdf}
                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md">
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
          <div className='trasacao'>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <p>Carregando transações...</p>
            </div>
          ) : transactionGroups.length > 0 ? (
            transactionGroups.map((group) => (
              <div className="mb-4" key={group.date}>
                <div className="flex gap-2 items-center mb-2">
                  <CalendarIcon className="text-gray-600 w-4 h-4" />
                  <span className="text-gray-700 font-medium">{formatDateHeader(group.date)}</span>
                </div>

                <div className="bg-white rounded-lg border overflow-hidden gap-3">
                  <div className="grid grid-cols-12 px-4 py-3 text-sm text-gray-600">
                    <div className="col-span-4 lg:col-span-3">Descritivo</div>
                    <div className="col-span-2 lg:col-span-2">Data Valor</div>
                    <div className="col-span-2 lg:col-span-2 text-right">Montante</div>
                    <div className="col-span-4 lg:col-span-3 text-right">Saldo após Movimento</div>
                    <div className="hidden lg:block lg:col-span-2"></div>
                  </div>

                  {group.transactions.map((transaction) => (
                    <div className="grid grid-cols-12 px-4 py-4 hover:bg-gray-50 gap-3" key={transaction.id}>
                      <div className="col-span-4 lg:col-span-3 flex items-center gap-3">
                        <div className="">
                          <Avatar size="sm"
                            classNames={{
                              base: "bg-[#AE8C46]",
                              icon: "text-black/80  flex items-center",
                              img: ' w-[20px] h-[20px]'
                            }}
                            icon={<AvatarIcon />}
                            radius="sm" src={transaction.Descricao === 'Levantamento sem cartão' ? '/icons/levan3.png' : transaction.Descricao.includes('Pagamento') ? 'icons/pagame3.png' : '/icons/trans9.png'} />

                        </div>
                        <span title={transaction.Descricao} className="text-gray-700 truncate text-14">{transaction.Descricao}</span>
                      </div>

                      <div className="col-span-2 lg:col-span-2 text-gray-600 flex items-center text-14">
                        <p>{format(parseISO(transaction.data), "d MMM yyyy", { locale: ptBR })}</p>
                      </div>
                      <div className="col-span-2 lg:col-span-2 text-right flex items-center justify-end text-14">
                        {transaction.debito ? (
                          <>
                            <ArrowDown className="w-4 h-4 mr-1 text-red-500" />
                            <span className='text-gray-700'>Kz {Number(transaction.debito).toLocaleString('pt-BR').replace('.', " ")}</span>
                          </>
                        ) : (
                          <>
                            <ArrowUp className="w-4 h-4 mr-1 text-green-500" />
                            <span className='text-gray-700'>Kz {Number(transaction.credtio || 0).toLocaleString('pt-BR').replace('.', " ")}</span>
                          </>
                        )}
                      </div>
                      <div className="col-span-3 lg:col-span-3 text-right flex items-center justify-end text-14">
                        <Plus className="w-4 h-4 mr-1 text-green-500" />
                        <span className='text-gray-700'>{transaction.saldoactual}</span>
                      </div>

                      <div className="col-span-1 lg:col-span-2 flex justify-end gap-2">
                        <button onClick={()=> window.open(`http://localhost:5000/pdf/comprovativo/${transaction.id}`)}>
                          <Download className="text-gray-500 w-5 h-5" />
                        </button>
                        <button>
                          <MoreVertical className="text-gray-500 w-5 h-5" />
                        </button>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center py-8">
              <p>Nenhuma transação encontrada.</p>
            </div>
          )}
          </div>
        </div>
      </div>
          {showGuide && <GuideDriver steps={TransacoesSteps} onFinish={()=>{
            console.log("Tour finalizado! Trasação concluída.");
            localStorage.setItem('GuiaTrasacaoeE', 'true');
            setShowGuide(false);
            }} />}
    </div>

  );
}