"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Back from "@/components/ui/Back/Back";
import Modal from "@/components/layout/Modal";
import { Botao } from "@/components/ui/Botao";

interface Carta {
	IdCarta: number;
	Nome: string;
	Tipo: string;
	Raridade: string;
}

interface ItemInventario {
	IdInventario: number;
	IdUsuario: number;
	IdCarta: number;
	Carta: Carta;
}

interface Baralho {
	idBaralho: number;
	nome: string;
	idUsuario: number;
	Inventarios: ItemInventario[];
}

export default function MeusBaralhosPage() {
	const router = useRouter();

	const [baralhos, setBaralhos] = useState<Baralho[]>([]);
	const [selecionado, setSelecionado] = useState<number | null>(null);
	const [erro, setErro] = useState<string>("");
	const [tituloErro, setTituloErro] = useState<string>("");
	const [mostrarErro, setMostrarErro] = useState<boolean>(false)
	const [carregando, setCarregando] = useState<boolean>(true);
	const [erroServidor, setErroServidor] = useState<boolean>(false);

	useEffect(() => {
		async function carregarBaralhos() {
			try {
				const usuarioSalvo = localStorage.getItem("usuario");

				if (!usuarioSalvo) {
					router.push("/login");
					return;
				}

				const usuario = JSON.parse(usuarioSalvo);

				const response = await fetch(
					`http://localhost:8081/Baralhos/${usuario.idUsuario}`
				);

				if (!response.ok) {
					throw new Error("Erro de conexão com a API");
				}

				const dados: Baralho[] = await response.json();
				setBaralhos(dados);
			} catch (err) {
				console.error(err);
				setErroServidor(true);
			} finally {
				setCarregando(false);
			}
		}

		carregarBaralhos();
	}, [router]);

	async function handleExcluir() {
		if (!selecionado) {
			setErro("Selecione um baralho para excluir.");
			setTituloErro("Erro na exclusão")
			setMostrarErro(true);
			
			return;
		}

		const confirmar = window.confirm("Deseja realmente excluir este baralho?");
		if (!confirmar) return;

		setErro("");

		try {
			const response = await fetch(
				`http://localhost:8081/Baralhos/${selecionado}`,
				{
					method: "DELETE",
				}
			);

			if (!response.ok) {
				throw new Error("Erro ao excluir o baralho");
			}

			setBaralhos((prev) => prev.filter((b) => b.idBaralho !== selecionado));
			setSelecionado(null);
		} catch (err) {
			console.error(err);
			setErro("Não foi possível excluir o baralho.");
			setTituloErro("Erro na exclusão")
			setMostrarErro(true);
		}
	}

	function handleEditar() {
		if (!selecionado) {
			setErro("Selecione um baralho para editar.");
			setTituloErro("Erro na edição")
			setMostrarErro(true);
			return;
		}

		router.push(`/montar-baralho?id=${selecionado}`);
	}

	if (erroServidor) {
		return (
			<div className="flex flex-col bg-custom-blue items-center w-full min-h-screen relative justify-center p-4">
				<div className="absolute top-10 left-10 z-10">
				<Botao
					texto="Voltar"
					nomeIcone="voltar"
					tamanhoIcone={40}
					corDoTexto="#FFFFFF"
					corDeFundo="transparent"
					corDaBorda="transparent"
					className="px-0 py-0 text-3xl"
					onClick={() => router.push("/")}
				/>
				</div>

				<p className="text-white text-2xl text-center">
				Não foi possível conectar-se com o servidor
				</p>
			</div>
		);
	}

	if (carregando) {
		return (
			<div className="flex flex-col bg-custom-blue items-center justify-center w-full min-h-screen relative text-white">
				<p className="text-2xl">Carregando...</p>
			</div>
		);
	}

	const metade = Math.ceil(baralhos.length / 2);
	const coluna1 = baralhos.slice(0, metade);
	const coluna2 = baralhos.slice(metade);

	return (
		<main className="flex flex-col bg-custom-blue items-center w-full min-h-screen relative">
			<div className="absolute top-10 left-10 z-10">
				<Botao
					texto="Voltar"
					nomeIcone="voltar"
					tamanhoIcone={40}
					corDoTexto="#FFFFFF"
					corDeFundo="transparent"
					corDaBorda="transparent"
					className="px-0 py-0 text-3xl"
					onClick={() => router.push("/")}
				/>
			</div>

			<div className="flex flex-col mt-[clamp(55px,9.778vh,105.6px)]">
				<p className="text-[clamp(32px,3vw,56px)] mb-12 text-white">Meus Baralhos</p>
			</div>

			{baralhos.length === 0 ? (
				<p className="text-white text-xl my-10">
					Você ainda não possui nenhum baralho criado.
				</p>
			) : (
				<div className="flex justify-center w-screen overflow-auto gap-30">
					<div className="flex flex-col justify-start items-center w-[clamp(271.5px,18.854vw,362px)] h-[clamp(150px,42.667vh,460.8px)] overflow-auto">
						{coluna1.map((baralho) => {
							const estaSelecionado = selecionado === baralho.idBaralho;
							return (
								<Botao
									texto= {baralho.nome}
									key={baralho.idBaralho}
									corDaBorda={estaSelecionado ? "#C8911A" : "#686868"}
									corDeFundo={estaSelecionado ? "#C8911A" : "#21366B"}
									raio={20}
									className="cursor-pointer w-[clamp(300px,18.833vw,400px)] h-[clamp(55px,8.889vh,96px)] text-[clamp(32px,2.708vw,52px)] border-5 flex items-center justify-center"
									onClick={() => {
										setErro("");
										setSelecionado(baralho.idBaralho);
									}}
								/>
							);
						})}
					</div>

					<div className="flex flex-col justify-start items-center w-[clamp(271.5px,18.854vw,362px)] h-[clamp(150px,42.667vh,460.8px)] overflow-auto">
						{coluna2.map((baralho) => {
							const estaSelecionado = selecionado === baralho.idBaralho;
							return (
								<Botao
									texto= {baralho.nome}
									key={baralho.idBaralho}
									corDaBorda={estaSelecionado ? "#C8911A" : "#686868"}
									corDeFundo={estaSelecionado ? "#C8911A" : "#21366B"}
									raio={20}
									className="cursor-pointer w-[clamp(300px,18.833vw,400px)] h-[clamp(55px,8.889vh,96px)] text-[clamp(32px,2.708vw,52px)] border-5 flex items-center justify-center"
									onClick={() => {
										setErro("");
										setSelecionado(baralho.idBaralho);
									}}
								/>
							);
						})}
					</div>
				</div>
			)}

			<div className="flex w-full mt-8 justify-center items-center gap-30 mb-[clamp(50px,8.889vh,96px)]">
				<Botao
				texto="Editar"
				raio={20}
				className="cursor-pointer w-[clamp(300px,18.833vw,400px)] h-[clamp(55px,8.889vh,96px)] text-[clamp(32px,2.708vw,52px)] border-5 hover:scale-105 transition-all flex items-center justify-center"
				onClick={ handleEditar }
				/>

				<Botao
				texto="Excluir"
				raio={20}
				className="cursor-pointer w-[clamp(300px,18.833vw,400px)] h-[clamp(55px,8.889vh,96px)] text-[clamp(32px,2.708vw,52px)] border-5 hover:scale-105 transition-all flex items-center justify-center"
				onClick={ handleExcluir }
				/>

			</div>

			<Botao
              texto="+ Criar Novo"
			  raio={20}
              className="cursor-pointer w-[clamp(300px,20.833vw,400px)] h-[clamp(55px,8.889vh,96px)] text-[clamp(32px,2.708vw,52px)] border-5 hover:scale-105 transition-all flex items-center justify-center"
              onClick={ () => router.push("/montar-baralho") }
            />
			<Modal
                aberto={mostrarErro}
                titulo={tituloErro}
                mensagem={erro}
                tipo={"erro"}
                onFechar={() => setMostrarErro(false)}
            />
		</main>
	);
}