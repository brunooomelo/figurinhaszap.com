import { DDI } from "./DDI";

export function hiddenPhone(texto: string): string {
  // Inicialmente, supomos que não encontramos um DDI no texto
  let ddiEncontrado = false;
  let ddi = '';

  // Iterar através da lista de países para verificar o texto
  for (const pais of DDI) {
    ddi = pais.ddi;
    
    if (texto.includes(ddi)) {
      // Se encontrarmos o DDI no texto, definimos as variáveis e saímos do loop
      ddiEncontrado = true;
      break;
    }
  }
  const textoSemDDI = texto.replace(ddi, '');

  // Se não encontrarmos um DDI, retornamos o texto original
  if (!ddiEncontrado) {
    return textoSemDDI.replace(/\d(?=\d{4})/g, '*');
  }

  // Removemos o DDI do texto original

  // Aplicamos a máscara nos quatro últimos dígitos
  const textoMascarado = textoSemDDI.replace(/\d(?=\d{4})/g, '*');
  
  // Retornamos o DDI, o código do país e a máscara
  return `${ddi}${textoMascarado}`;
}

