'use client'
import Sidebar from "@/components/sidebar/Sidebar";
import useContaStore from "@/contexts/contaStore";
import { DadosContaType } from "@/types/commons";
import dynamic from "next/dynamic"
import {   Search } from "lucide-react";
import { useEffect, useState,KeyboardEvent } from "react";
import Transferencias from "../transferencias/page";
 //import Pagamentos from "../pagamentos/page";
import Home from "../inicio/page";
import Levantamentos from "../levantamentos/page";
import Senha from "../senha/page";
import Deposito from "../deposito/page";
import TransactionsPage from "../transacoes/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select"
import Conta from "../conta/page";
import { formataNome } from "@/constants/modules";
interface DashboardProps {
  idConta: number | undefined;
  dadosConta: DadosContaType | undefined;
}


export default function Dashboard({ idConta, dadosConta }: DashboardProps) {

  const MapaComponent = dynamic(() => import("@/components/Mapa/mapa"), { ssr: false })


  const [page, setPage] = useState<string>("inicio");
  const useConta = useContaStore();
  const pesquisar=(e:KeyboardEvent<HTMLInputElement>)=>{
    if(e.key==="Enter"){
      let valor=e.currentTarget.value;
      valor=valor.toLowerCase();
      setPage(valor); // 
    }
  }
  console.log(dadosConta)
  useEffect(() => {
    if (dadosConta) {

      useConta.setSaldo(dadosConta.saldo);
      useConta.setIban(dadosConta.iban);
      useConta.setNumeroConta(dadosConta.numeroConta);
      useConta.setIdTipoConta(dadosConta.idTipoConta);
      useConta.setDataAbertura(dadosConta.dataAbertura);
      useConta.setEstado(dadosConta.estado);
      useConta.setCliente(dadosConta.cliente);
      useConta.setCartao(dadosConta.cartao);
      
    }

    if (idConta) {
      useConta.setId(idConta);
    }
  }, [])

  useEffect(() => {
    const buttons = document.querySelectorAll(".btn[data-active]") as NodeListOf<HTMLButtonElement>;


    function update(button: HTMLButtonElement) {
      for (const btn of buttons) {
        btn.dataset.active = "false";
      }
      button.dataset.active = "true";
    }

    for (const button of buttons) {
      button.addEventListener("click", () => {
        update(button);
        setPage(button.dataset.page || "");
      });
    }

  }, []);


  return (
    <main className=" grid lg:grid-cols-5  h-screen ">
      <Sidebar />

      <div className="lg:col-span-4 flex flex-col overflow-hidden bg-white ">
        {/* Header */}
        <header className="z-10">
          <div className="flex items-center justify-between p-4">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder="Pesquisar BPA NET"
                onKeyDown={pesquisar}
              />
            </div>
            <div className="flex items-center">
              
              <div className="ml-3 relative">
                <Select  onValueChange={(value: string) => setPage(value)}>
                  <SelectTrigger className="border-none">
                  <div className="flex items-center">
                    <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>{dadosConta?.cliente?.nome.charAt(0) || "N/A"}</AvatarFallback>
                    </Avatar>
                  </div>
                  </SelectTrigger>
                  <SelectContent>
                  <SelectGroup>
                  <SelectLabel>{formataNome(dadosConta?.cliente.nome)}</SelectLabel>
                    <SelectItem value="mapa">Perfil</SelectItem>
                    <SelectItem value="Senha">Alterar Senha</SelectItem>
                  </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="px-4 py-2 border-t  flex items-center">

          </div>
        </header>

        <main className="flex-1 overflow-y-auto py-2 px-4 sm:px-6 lg:px-6 bg-white no-scrollbar xl:overflow-y-scroll">
          {page === "inicio" ? (
            <Home dadosConta={dadosConta} setDashboardPage={setPage} />
          ) : page === "transferencias" ? (
            <Transferencias dados={dadosConta} />
          ) : page === "mapa" ? (
            <MapaComponent />
          )
            // : page === "pagamentos" ? (
            //   <Pagamentos />) 
           
            : page === "levantamentos" ? (
              <Levantamentos dados={dadosConta} />
            ) : page === "transacoes" ? (
              <TransactionsPage />
            ): page === "Senha" ? (
              <Senha />
            ): page === "conta" ? (
                <Conta dados={dadosConta} />
              ): page === "deposito" ? (
                <Deposito />
              ):
              null}
        </main>
      </div>
      
    </main>

  );
}
