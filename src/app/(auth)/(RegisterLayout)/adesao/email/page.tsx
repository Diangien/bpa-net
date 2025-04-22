"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Mail, MailOpen } from "lucide-react";
import api from "@/utils/axios";
import { TailSpin } from "react-loader-spinner";
import { AxiosError } from "axios";
import Image from "next/image";
import  useUserStore  from "@/contexts/userStore";
const verifyEmailSchema = z.object({
  email: z.string(),
});

type verifyEmailSchema = z.infer<typeof verifyEmailSchema>;

const EtapaEmailPage = () => {
  const { register, handleSubmit } = useForm<verifyEmailSchema>({
    resolver: zodResolver(verifyEmailSchema),
  });

  const { setEmail } = useUserStore();

  const [isLoading, setIsLoading] = useState(false);
  const [sucessEmail, setSucessEmail] = useState(false);

  async function handleVerifyEmail(data: verifyEmailSchema) {
    setIsLoading(true);

    try {
      await api.post("/adesao/emailvalidate", data);
      setSucessEmail(true);
      setEmail(data.email);
      if (typeof window !== "undefined") {
        localStorage.setItem("email", data.email);
      }
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
    <>
      {!sucessEmail ? (
        <form onSubmit={handleSubmit(handleVerifyEmail)} className="flex flex-col gap-3" autoComplete="off">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold">Email</h2>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">
              Bem-vindo ao nosso Internet Banking! Vamos configurar sua conta em poucos passos
            </p>
            <p className="text-sm text-gray-900">
              Para começar sua adesão, informe o e-mail vinculado à sua conta BPA
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Input {...register("email")} type="email" required />
            </div>
          </div>

          <Button type="submit" disabled={isLoading}>
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
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MailOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold">Link de verificação enviado!</h2>
          </div>
      
          <div className="px-4">
            <span className="text-sm text-gray-800">
              Verifique a sua caixa de entrada e clique no link de verificação para continuar o processo de adesão.&nbsp; 
            </span>
            <span className="hover:underline text-blue-400 cursor-pointer" 
              onClick={()=>{setSucessEmail(false)}}>Corrigir email.</span>

            <div className="flex mx-auto">
              <Image
                src="/banners/sendEmail.svg"
                alt="Email de Verificação enviado"
                width={400}
                height={90}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

{
  /* <div>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold">Email</h2>
      </div>

      <p className="text-gray-600 mb-6">
        Bem-vindo ao nosso Internet Banking! Vamos configurar sua conta em poucos passos
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Para começar sua adesão, informe o e-mail vinculado à sua conta BPA
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Seu email"
          />
        </div>
      </div>
    </div> */
}

export default EtapaEmailPage;
