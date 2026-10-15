



type LinhaDescricao = 
{
    cor?: string;
    rotulo?: string;
    valor?: string;
    text?: string;
    className: string;
       
}





export default function DescricaoCarta({className}: {className: string}) // Fazer Genérico depois
{
    const Conteudo = DefaultCarta() //Aplicar Back depois
    
    return (
        <div className={className}> 
        {Conteudo.map((item, i) => {
            if (item.rotulo) 
                {
                    return(<p key={i} className={item.className}><span className={item.cor}>{item.rotulo}</span> <span className={item.cor}>{item.valor}</span></p>);  
                }
                else {
                    return(<p key={i} className={item.className}>{item.text}</p>);}

            })}
            </div>

    )


}




function DefaultCarta() : LinhaDescricao[] 
{
    return [{ text: "Tipo: Personagem", className: "p-0.5"},
        { className: "p-0.5", rotulo: "Raridade", valor: "Comum", cor: "text-green-400"},
        { className: "p-0.5", rotulo: "Preço", valor: "10", cor: "text-yellow-400"},
        { text: "", className: "h-3" },
        { text: "[Ação 1]", className: "p-0.5 text-yellow-500" },
        {text: "Bola De Fogo", className: "p-0.5"},
        {text: "Lança uma bola de fogo legal", className: "p-0.5"},
        {text: "Cuidado para não se queimar", className: "p-0.5"},
        {text: "", className: "h-3"},
        {text: "[Ação 2]", className: "p-0.5 text-yellow-500"},
        {text: "Xingamento pesado", className: "p-0.5"},
        {text: "Causa dano emocional", className: "p-0.5"}
    ]
}


