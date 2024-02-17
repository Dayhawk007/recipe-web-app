import Image from "next/image";

export default function Login(){
    return(
        <div className="flex flex-col relative overflow-hidden h-screen w-screen justify-center z-10 items-center">
            <Image src="/images/login-bg.png" alt="Background Image" height={1200} width={1550} className="absolute top-0 left-0 -z-10"/>
            <div className="flex flex-col bg-primary items-center space-y-6 px-24 py-12">
                <h4 className="text-3xl text-dark-gray">Log In</h4>
                
            </div>
        </div>
    )
}