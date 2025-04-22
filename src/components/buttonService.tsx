  "use client";

  import Image /*{ StaticImageData }*/ from "next/image";
  import React from "react";
//  import { Dispatch, SetStateAction } from "react";

  interface IButtonServiceProps {
    image: string;
    serviceName: string;
    onClick: ()=>void;
  }

  function ButtonService({
    image,
    serviceName,
    onClick
  }: IButtonServiceProps) {
    const handleClick = () => {
      onClick()
    };

    return (
      <li
        data-active="false"
        onMouseDown={handleClick}
        className="btnService flex gap-4 items-center justify-start rounded-[7px] bg-[var(--color-cards)] w-full h-[50px] px-[10px]"
        style={{ minHeight: "50px", transition: ".3s" }}
      >
        <Image
          src={image}
          alt="image_service"
          width={34}
          height={34}
          className="rounded-[3px]"
        />
        <p style={{ transition: ".3s" }}>{serviceName}</p>
      </li>
    );
  }

  export default React.memo(ButtonService);
