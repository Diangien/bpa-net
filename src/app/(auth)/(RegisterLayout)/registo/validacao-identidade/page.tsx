/* eslint-disable react-hooks/exhaustive-deps */
"use client";

//import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as faceapi from "face-api.js";
import Tesseract from "tesseract.js";
//import {useUserStore} from "@/contexts/userStore";
import { useStepperRegistoStore } from "@/contexts/stepsStore";
import UploadCard from "@/components/Cards/UploadCard";
import UploadCard2 from "@/components/Cards/UploadCard2";
import Uploader from "@/components/Cards/Uploader";
import "@/styles/upload.css";
import { TailSpin } from "react-loader-spinner";

const MAX_FILE_SIZE: number = parseInt(process.env.MAX_FILE_SIZE ?? "5242880");
const regexBI = /^[0-9]{9}[A-Z]{2}[0-9]{3}$/;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/webp", "image/png"];

interface FileState {
  haveFile: boolean;
  type: string;
  name: string;
  size: number;
  file: File | null;
}

export default function IdentityValidation() {
  //const useStore = useUserStore();
  const router = useRouter();
  const stepsStore = useStepperRegistoStore();
  const [loading, setLoading] = useState(false);
  const idCardRef = useRef<HTMLImageElement>(null);
  const selfieRef = useRef<HTMLImageElement>(null);
  //const [success, setSuccess] = useState(false);
  const [frontFile, setFrontFile] = useState<FileState>({
    haveFile: false,
    type: "",
    name: "",
    size: 0,
    file: null,
  });
  const [backFile, setBackFile] = useState<FileState>({
    haveFile: false,
    type: "",
    name: "",
    size: 0,
    file: null,
  });

  //let email = "";
  // if (typeof window !== "undefined") {
  // 	email = localStorage.getItem("email") ?? useStore.email
  // }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    stepsStore.setCurrentStepRegisto(2);
  }, []);

  useEffect(() => {
    if (!backFile.haveFile) {
      const input = document.getElementById("i2") as HTMLInputElement;
      if (input) {
        input.value = "";
      } else {
        alert("Null");
      }
    } else {
    }
  }, [backFile.haveFile]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!frontFile.haveFile) {
      const input = document.getElementById("i1") as HTMLInputElement;
      if (input) {
        input.value = "";
      } else {
        alert("Null");
      }
    } else {
    }
  }, [frontFile.haveFile]);

  function compareBI(bi1: string, bi2: string) {
    if (bi1.toLocaleUpperCase() === bi2.toLocaleUpperCase()) {
      return true;
    }
    return false;
  }

  function cleanText(text: string): string {
    return text
      // Corrigir "C0" para "CO"
      .replace(/C0/g, "CO")
      // Outras correções específicas, se necessário
      .replace(/B0O/g, "BO")
      .replace(/0O/g, "O");
  }
  function testRegex() {
    setLoading(true);
    let biNumber = "";
    let scanned = false;
    // biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
    return new Promise(async (resolve, reject) => {
      const response = await Tesseract.recognize(
        URL.createObjectURL(frontFile.file || new File([], "")),
        
      );
      //const words = response.data.words;
      let text = response.data.text;

    // Limpar o texto reconhecido
    text = cleanText(text);
      // Dividir o texto em palavras e procurar pelo BI
      const words = text.split(/\s+/);
      console.log(words);
      if (words) {
        for (const word of words) {
          if (regexBI.test(word)) {
            biNumber = word;
            scanned = true;
            break;
          }
        }
      } else {
        toast.error("Envie uma imagem do seu BI");
        setLoading(false);
      }

      if (scanned) {
        const response = localStorage.getItem("numeroBi");
        if (response) {
          const isSame = compareBI(response, biNumber);
          if (isSame) {
            resolve("BI validado com sucesso!");
          } else {
            reject("BI Diferente!");
          }
        } else {
          reject("Não foi possível verificar o seu BI1!");
        }
      } else {
        reject("Não foi possível validar o seu BI!"+biNumber);
      }
      setLoading(false);
    });
  }

  async function validateFaces() {
    const MODEL_URL = "/models";
    setLoading(true);
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL), // Atualize conforme necessário
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL), // Atualize conforme necessário
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL), // Atualiz
    ]);

    // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
    let idCard;
    // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
    let idSelfie;

    if (idCardRef.current) {
      const idCardFacedetection = await faceapi
        .detectSingleFace(idCardRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();
      idCard = idCardFacedetection;
      if (!idCardFacedetection) {
        toast.error("Não foi possivel validar a imagem do BI enviada!", {
          description: "Tente enviar outra com melhor visibilidade.",
        });
        setLoading(false);
      }
    }

    if (selfieRef.current) {
      const selfieFacedetection = await faceapi
        .detectSingleFace(selfieRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();
      idSelfie = selfieFacedetection;
      if (!idSelfie) {
        toast.error("Não foi possivel validar a selfie enviada!", {
          description: "Tente enviar outra com melhor visibilidade.",
        });
        setLoading(false);
      }
    }

    if (idCard && idSelfie) {
      const distance = faceapi.euclideanDistance(idCard.descriptor, idSelfie.descriptor);
      if (distance < 0.5) {
        toast.success("Validação facial pessoas iguais!"+distance);
        router.push("/registo/credenciais");
      } else {
        toast.warning("Pessoas diferentes."+distance);
        setLoading(false);
      }
    }
  }

  async function verify() {
    toast.promise(testRegex(), {
      loading: "Analisando o Bilhete de Identidade...",
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      success: (data: any) => {
        //setSuccess(true);
        validateFaces();
        return data;
      },
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      error: (data: any) => {
        return data;
      },
    });
  }

  function validateForm(): boolean {
    if (!frontFile.haveFile && !backFile.haveFile) {
      toast.error("Faça upload das imagens para continuar!");
      return false;
    }
    if (!frontFile.haveFile) {
      toast.error("Faça upload da parte frontal do BI!");
      return false;
    }
    if (!backFile.haveFile) {
      toast.error("Faça upload da sua selfie pessoal!");
      return false;
    }
    return true;
  }

  async function formSubmit() {
    if (validateForm()) {
      await verify();
    } else {
    }
  }
  console.log(idCardRef.current);
  console.log(selfieRef.current);

  return (
    <form className="login_form identity_verification">
      <div className="header_form">
        <h1>Validação de identidade</h1>
        <p>Faça upload das imagens abaixo. </p>
      </div>
      <div className="body_form">
        <div className="uploaders_container">
          <div className="upload_container">
            <p className="simple_text">Bilhete de Identidade</p>
            {frontFile.haveFile ? (
              <Uploader
                fileName={frontFile.name}
                fileSize={frontFile.size.toString()}
                imageAlt="bi-frente"
                imageType={frontFile.type.replace("image/", "").trim()}
                key={"1"}
                file={frontFile.file || new File([], "")}
                imageRef={idCardRef}
                handleClick={() =>
                  setFrontFile({
                    haveFile: false,
                    type: "",
                    name: "",
                    size: 0,
                    file: null,
                  })
                }
              />
            ) : (
              <UploadCard
                inputId="i1"
                key={"upload_area1"}
                inputName="image"
                acceptedImageTypes={ACCEPTED_IMAGE_TYPES}
                maxFileSize={MAX_FILE_SIZE}
                setState={setFrontFile}
              />
            )}
          </div>
          <div className="upload_container">
            <p className="simple_text">Fotografia tipo passe</p>
            {backFile.haveFile ? (
              <Uploader
                fileName={backFile.name}
                fileSize={backFile.size.toString()}
                imageAlt="bi-verso"
                imageType={backFile.type.replace("image/", "").trim()}
                key={2}
                file={backFile.file || new File([], "")}
                imageRef={selfieRef}
                handleClick={() =>
                  setBackFile({
                    haveFile: false,
                    type: "",
                    name: "",
                    size: 0,
                    file: null,
                  })
                }
              />
            ) : (
              <UploadCard2
                inputId="i2"
                key={"upload_area2"}
                inputName="image"
                acceptedImageTypes={ACCEPTED_IMAGE_TYPES}
                maxFileSize={MAX_FILE_SIZE}
                setState={setBackFile}
              />
            )}
          </div>
        </div>
        <button type="button" disabled={loading} onClick={formSubmit} className="button_auth">
          {loading ? (
            <TailSpin
              height="25"
              width="25"
              color="#fff"
              ariaLabel="tail-spin-loading"
              radius="1"
              visible={true}
            />
          ) : (
            "Validar"
          )}
        </button>
      </div>
    </form>
  );
}
