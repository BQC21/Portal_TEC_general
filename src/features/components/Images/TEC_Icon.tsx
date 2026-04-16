import Image from 'next/image'
import tec_icon from './tec_icon.png' // Import your image file

export default function TECIcon() {
    return (
        <Image
            src={tec_icon}
            alt="icono de la empresa"
            priority
            width={180}
            height={72}
            className="h-12 w-auto object-contain"
        />
    )
}