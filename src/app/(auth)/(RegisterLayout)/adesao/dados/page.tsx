"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useStepperStore } from "@/contexts/stepsStore";
import { ArrowRight, User } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/utils/axios";
import { AxiosError } from "axios";
import { TailSpin } from "react-loader-spinner";
import { toast } from "sonner";
import useUserStore  from "@/contexts/userStore";
const personalDataSchema = z.object({
  bi: z.string(),
  numeroconta: z.string(),
});

type personalDataSchema = z.infer<typeof personalDataSchema>;

const EtapaDadosPage = () => {
  const { register, handleSubmit } = useForm<personalDataSchema>({
    resolver: zodResolver(personalDataSchema),
  });

  const userStore = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const { currentStep, setCurrentStep } = useStepperStore();

  const router = useRouter();

  let email = "";
  if (typeof window !== "undefined") {
    email = localStorage.getItem("email") ?? userStore.email;
  }

  useEffect(() => {
    setCurrentStep(2);
  }, [currentStep, setCurrentStep]);

  async function handleVerifyPersonalData(data: personalDataSchema) {
    try {
      setIsLoading(true);
      const response = await api.post(`/adesao/findaccounts/${email}`, data);
      if (typeof window !== "undefined") {
        localStorage.setItem("idconta", response.data.idconta);
      }
      router.push("/adesao/contrato");
      toast.success("Dados verificados com sucesso");
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
  }
  return (
    <form onSubmit={handleSubmit(handleVerifyPersonalData)} className="w-full" autoComplete="off">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold">Dados Pessoais</h2>
      </div>

      <p className="text-gray-600 mb-8">
        Para prosseguir com seu cadastro, precisamos confirmar alguns dados pessoais
      </p>

      <div className="space-y-6 w-full">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
          <Input type="text" placeholder="Digite seu nome completo" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Número da Conta</label>
          <Input
            type="text"
            placeholder="Digite o número da sua conta"
            {...register("numeroconta")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Número do BI</label>
          <Input type="text" placeholder="Digite o número do seu BI" {...register("bi")} required />
        </div>

        <div className="w-full"></div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
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
    </form>
  );
};

export default EtapaDadosPage;
