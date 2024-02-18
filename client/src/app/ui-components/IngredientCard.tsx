import Image from "next/image"


interface CardProps{
    imageUrl:string,
    name:string,
    buttonText:string,
    onClick:()=>void,
}

const Card = ({ imageUrl, name, buttonText, onClick }:CardProps) => {
  return (
    <div className=" bg-white flex flex-col px-4 py-4 border border-black rounded-md justify-center space-y-2 items-center overflow-hidden shadow-lg">
      <Image src={imageUrl} alt={name} height={120} width={120}/>
      <div className="flex flex-row space-x-4 text-black items-center border border-black px-4 py-2 rounded-2xl">
        <div className="font-normal text-sm">{name}</div>
        <button
          className="bg-primary text-white px-2 py-1 rounded-md"
          onClick={onClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Card;
