"use client";

import Link from "next/link";
import styles from "@/styles/aderir_login.module.css";
// import { AxiosError } from "axios";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
import CustomInput from "./CustomInput";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
// import api from "@/utils/axios";
// import { TailSpin } from 'react-loader-spinner'
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// const FormSchema = z.object({
//   numeroadessao: z.string(),
//   accessCode: z.string(),
// });

// type FormType = z.infer<typeof FormSchema>;

export default function AuthForm() {

  // const router = useRouter();
  // const [isLoading, setIsLoading] = useState(false)

  // const {
  //   register,
  //   formState: { errors },
  //   handleSubmit,
  // } = useForm<FormType>({
  //   resolver: zodResolver(FormSchema),
  // });

  // const submitForm = async (data: FormType) => {
  //   setIsLoading(true);
  //   try {
  //     await api.post("/openacount/emailvalidete", data);
  //     setEmail(data.email);
  //     if (typeof window !== "undefined") {
  //       localStorage.setItem("email", data.email);
  //     }
  //     router.push("/email-verification");
  //     //router.push("/registo/tipo-conta");
  //   } catch (error) {
  //     if (error instanceof AxiosError) {
  //       if (error.response?.status === 400) {
  //         toast.error(error.response?.data.message);
  //       } else {
  //         toast.error("Sem conexão com o servidor");
  //       }
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-6">
        {/* <div className=" flex mb-3 items-center gap-2 justify-center">
          <Image src={`/icons/logo_favicon.svg`} width={36} height={36} alt="BPA Logo" />
          <h1 className="text-30 font-ibm-plex-serif font-bold text-black-1">
            BPA <span className="text-sm">NET</span>
          </h1>
        </div> */}

        <div
          className={` flex cursor-pointer items-center gap-1 
            justify-center`}
        >
          <Image
            src={`/icons/logo_favicon.svg`}
            width={10}
            height={10}
            alt="Logo horizontal"
            className="size-[20px]  md:size-[36px] max-md:size-8"
          />

          <h1 className="text-30 font-ibm-plex-serif font-bold text-black-1">BPA</h1>
        </div>

        <div className="flex flex-col gap-1 md:gap-3 text-center">
          <h1 className={`${styles.titulo} font-semibold text-gray-600`}>
            Entre no BPA Net
            {/* <p className={`${styles.subtitulo} font-normal text-gray-600 mt-[9px]`}>
              Ainda não tem uma conta?{" "}
              <Link href={"/aderir"} className={`${styles.corlink} underline cursor-pointer`}>
                Criar conta
              </Link>
            </p> */}
          </h1>
        </div>
      </header>

      <form className="space-y-4">
        <CustomInput
          name="username"
          label="Nº de Adesão ou Email"
          placeholder="Insira o Nº de Adesão ou Email"
        />

        <CustomInput
          name="codigo"
          label="Código de Acesso"
          placeholder="Insira o seu código de acesso"
        />

        <Link href={"/inicio"} className={`button_auth`}>
          Entrar <ArrowRight strokeWidth={3} size={16} className="relative top-[1px]" />
        </Link>
      </form>

      {/* <div className="">
        <p className="text-14 text-center   text-gray-600">
          {" "}
          <span className={`${styles.corlink} underline cursor-pointer`}>
            Politicas de Privacidade
          </span>{" "}
          são aplicáveis
        </p>
        <p className=" text-gray-400 text-14 absolute bottom-5  right-[200px]  ">
          &copy; 2025 Banco de Poupança
        </p>
      </div> */}

      <Link href={"/aderir"} className={`${styles.aderirCard} bg-gray-200`}>
        <div className={`${styles.textoCard}`}>
          <span className={`${styles.tituloCard}`}>Ainda não aderiu ao BPA NET?</span>
          <span className={`${styles.mesagemcard}`}>
            Com o BPA NET poderá realizar todas as suas operações em qualquer lugar.
          </span>
        </div>
        <ArrowRight strokeWidth={2} size={20} className="" />
      </Link>
    </section>
  );
}
