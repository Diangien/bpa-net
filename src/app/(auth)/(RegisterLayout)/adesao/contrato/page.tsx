"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStepperStore } from "@/contexts/stepsStore";

import { Checkbox } from "@nextui-org/react";

//import styles from "@/styles/contrato.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { TailSpin } from "react-loader-spinner";
import api from "@/utils/axios";
import useUserStore  from "@/contexts/userStore";
import { AxiosError } from "axios";
import { toast } from "sonner";
import FingerprintJS from "@fingerprintjs/fingerprintjs"; // lib que cria um id unico do navegador/dispositivo do usuario
import Browser from "bowser"; // lib para pegar o sitema operativo e o navegador do usuario

const ContratoPage = () => {
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentStep, setCurrentStep } = useStepperStore();
  const [id, setid] = useState<string>();
  const [navegador, setnavegador] = useState<string>();
  const [sistemaoperativo, setsistemaoperativo] = useState<string>();
  const router = useRouter();

  const userStore = useUserStore();

  let email = "";
  let idconta = "";
  if (typeof window !== "undefined") {
    email = localStorage.getItem("email") ?? userStore.email;
    idconta = localStorage.getItem("idconta") || "";
  }

  useEffect(() => {
    setCurrentStep(3);
  }, [currentStep, setCurrentStep]);

  useEffect(() => {
    // função que coleta os dados do usuario
    const collectFingerprint = async () => {
      const fp = await FingerprintJS.load();
      // result recebe os dados coletados  do dispositivo/usuario
      const result = await fp.get();
      // pegando o Id unico
      setid(result.visitorId);

      const browserInfo = Browser.getParser(navigator.userAgent);
      // getBrowserName retorna o nome do navegador do usuario
      setnavegador(browserInfo.getBrowserName());
      console.log(navegador+"---"+browserInfo.getBrowserName())
      //// getOS retorna o nome do sistema operativo  do usuario
      setsistemaoperativo(browserInfo.getOS().name);
    };

    //chamada da função
    collectFingerprint();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/adesao/sendcredential", {
        email: email,
        navegador: navegador,
        sistemaoperativo: sistemaoperativo,
        iddispositivo: id,
        idconta: idconta,
      });

      router.push("/adesao/credenciais");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          toast.error(error.response?.data.message);
        } else {
          toast.error("Sem conexão com o servidor");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold">Contrato de Adesão</h2>
      </div>

      <div className=" h-fit overflow-y-auto mb-4">
        <div className="space-y-6 text-gray-600">
          <h2 className="text-xl font-semibold text-gray-800">BPA NET</h2>

          <div className="flex">
            <div className="md:w-2/3">
              <p>
                O BPA NET é a plataforma de internet banking do Banco BPA. Através dela, o cliente pode consultar
                saldos, efetuar pagamentos, transferências e outras operações de forma rápida e
                prática. Disponível 24 horas por dia, o BPA NET garante total segurança e eficiência
                para a sua experiência bancária digital.
              </p>
            </div>
            <div className="md:w-1/3 flex items-end">
              <Image
                src={"/banners/contrato.svg"}
                alt="BPA NET"
                width={400}
                height={50}
                className="hidden md:flex"
              />
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-600 flex items-center gap-2 mb-4 cursor-pointer" onClick={()=> {window.open('/arquivos/contrato_adesao.pdf', '_blank')}}>
        <Download className="w-6 h-6" strokeWidth={2.5} /> Baixar contrato de adesão
      </p>

      <div className="bg-white rounded-xlp-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            classNames={{
              label: "text-small",
            }}
            onChange={() => setAccepted(!accepted)}
          >
            Li e aceito todos os{" "}
            <span className="text-blue-600">termos e condições do contrato</span>
          </Checkbox>
        </label>
        <Button
          className={`mt-6 w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all
                      ${
                        accepted
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-blue-500 text-white cursor-not-allowed"
                      }`}
          disabled={!accepted}
          type="submit"
        >
          {isLoading ? (
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
              Continuar
              <ArrowRight style={{ width: "1.25rem", height: "1.25rem" }} />
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ContratoPage;
