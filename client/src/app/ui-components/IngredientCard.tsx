import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image"


interface CardProps{
    imageUrl:string,
    name:string,
    icon:any,
    iconColor:string,
    onClick:()=>void,
}

const Card = ({ imageUrl, name, icon,iconColor, onClick }:CardProps) => {
  return (
    <div className=" bg-white flex flex-col md:p-4 px-2 py-4 border border-black rounded-md justify-between space-y-2 items-center overflow-hidden shadow-lg">
      <Image src={imageUrl} alt={name} height={120} width={120}/>
      <div className="flex flex-row md:justify-center space-x-4 text-black items-center border border-black w-full px-4 py-2 rounded-md md:rounded-2xl">
        <div className="font-normal text-sm text-center">{name}</div>
        <button
          className={` ${iconColor} text-white md:h-fit w-fit px-2 py-0.5 rounded-md`}
          onClick={onClick}
        >
          <FontAwesomeIcon className={`${iconColor}`} size={"sm"} icon={icon}/>
        </button>
      </div>
    </div>
  );
};

export default Card;
