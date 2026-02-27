import { WHATSAPP_NUMBERS } from '../constants/whatsappNumbers'
import { CONFIG } from '../config'

export function sortearNumero() {
  if (!WHATSAPP_NUMBERS.length) return CONFIG.WHATSAPP_FALLBACK
  const index = Math.floor(Math.random() * WHATSAPP_NUMBERS.length)
  return WHATSAPP_NUMBERS[index]
}

export function gerarLinkWhatsApp(numero, mensagem) {
  const numeroLimpo = (numero || CONFIG.WHATSAPP_FALLBACK).replace(/\D/g, '')
  const msgEncoded = encodeURIComponent(mensagem)
  return `https://wa.me/${numeroLimpo}?text=${msgEncoded}`
}

export const MENSAGENS_WHATSAPP = {
  badge:
    'Ola, vi a calculadora de direitos trabalhistas no site e gostaria de falar com um advogado.',
  resultado:
    'Ola, fiz o calculo dos meus direitos no site e gostaria de falar com um advogado.',
  prescricao:
    'Ola, tentei usar a calculadora mas pode ter passado o prazo. Gostaria de falar com um advogado para entender minha situacao.',
  geral: 'Ola, gostaria de falar com a advocacia.',
}
