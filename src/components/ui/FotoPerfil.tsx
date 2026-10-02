"use client";

import Image from "next/image";
import { useState } from "react";

interface FotoPerfilProps {
    idUsuario: number;
    tamanho?: number;
    className?: string;
    atualizacao?: number;
}

export function FotoPerfil({
    idUsuario,
    tamanho = 40,
    className = "",
    atualizacao = 0
}: FotoPerfilProps) {
    const [temFoto, setTemFoto] = useState(true);

    if (!temFoto) {
        return (
            <div
                className={`rounded-full bg-gray-500 ${className}`}
                style={{
                    width: tamanho,
                    height: tamanho
                }}
            />
        );
    }

    return (
        <Image
            key={`${idUsuario}-${atualizacao}`}
            src={`http://localhost:8081/Usuarios/${idUsuario}/foto?t=${atualizacao}`}
            alt="Foto de perfil"
            width={tamanho}
            height={tamanho}
            unoptimized
            className={`rounded-full object-cover ${className}`}
            onError={() => setTemFoto(false)}
        />
    );
}