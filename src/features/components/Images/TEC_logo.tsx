import Image from 'next/image'
import tec_logo from './tec_logo.png' // Import your image file

export default function TECLogo() {
    return (
        <Image
            src={tec_logo}
            alt="Logo de la empresa"
            loading="eager"
            // width and height are automatically provided
            // placeholder="blur" // Optional: adds a blur-up effect
        />
    )
}