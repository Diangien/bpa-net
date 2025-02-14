import { Header } from "@/Components/Header";
import Link from "next/link";

const AderirPage = () => {
  return (
    <div className="relative">
      <Header />
      <div className="max-w-[1000px] mx-auto px-6 flex flex-col items-center md:flex-row gap-4 py-6 min-h-60 ">
        <Link href='/novaConta' className="cartaoAdesao">
          <div className="flex flex-col gap-2">
            <h1 className="tituloCartaoAdesao text-azul font-bold">Criar Conta Bancaria</h1>
            <p className="text-sm text-gray-600">O seu banco na palma da sua mao</p>
          </div>

          <div></div>
        </Link>

        <Link href='/novaAdesao' className="cartaoAdesao">
          <div className="flex flex-col gap-2">
            <h1 className="tituloCartaoAdesao text-azul font-bold">Aderir ao BPA Net</h1>
            <p className="text-sm">Se já é cliente BPA pode aderir ao BPA Net sem ir ao balcão</p>
          </div>

          <div></div>
        </Link>
      </div>
    </div>
  );
};

export default AderirPage;
