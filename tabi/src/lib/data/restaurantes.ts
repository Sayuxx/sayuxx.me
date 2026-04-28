import type { Restaurante } from '../types';

export const RESTAURANTES: Restaurante[] = [
	// === Kyoto ===
	{
		id: 'kyoto-honke-owariya',
		destinoId: 'kyoto',
		nome: 'Honke Owariya',
		especialidade: 'Soba tradicional, 600 anos de casa',
		faixaPreco: 'alto',
		precoMedio: '¥1.500-3.000 / pessoa',
		bairro: 'Higashiyama',
		notaLocal: 'Peça o "Hourai Soba" — empilhado em 5 tigelas com guarnições. É a versão de festa.'
	},
	{
		id: 'kyoto-issen-yoshoku',
		destinoId: 'kyoto',
		nome: 'Issen Yoshoku',
		especialidade: 'Okonomiyaki Kyoto-style — uma única receita',
		faixaPreco: 'baixo',
		precoMedio: '¥800-1.200 / pessoa',
		bairro: 'Gion',
		notaLocal: 'Cardápio tem 1 item. Decoração trash-icônica com manequins. Vibe absurda.'
	},
	{
		id: 'kyoto-menami',
		destinoId: 'kyoto',
		nome: 'Menami',
		especialidade: 'Obanzai (cozinha caseira refinada)',
		faixaPreco: 'medio',
		precoMedio: '¥3.000-5.000 / pessoa',
		bairro: 'Pontocho',
		notaLocal: 'Sente no balcão e veja todas as panelinhas. Aponte o que quiser — "kore" funciona.'
	},
	{
		id: 'kyoto-kichi-kichi',
		destinoId: 'kyoto',
		nome: 'Kichi Kichi Omurice',
		especialidade: 'Omurice flambada de balcão',
		faixaPreco: 'medio',
		precoMedio: '¥2.500-3.500 / pessoa',
		bairro: 'Pontocho',
		notaLocal: 'Reserva online é obrigatória. O show do chef Motokichi é a metade da experiência.'
	},

	// === Tokyo ===
	{
		id: 'tokyo-sushi-dai',
		destinoId: 'tokyo',
		nome: 'Sushi Dai',
		especialidade: 'Sushi de balcão no mercado',
		faixaPreco: 'alto',
		precoMedio: '¥4.000-6.000 / pessoa',
		bairro: 'Toyosu',
		notaLocal: 'Fila começa às 4h. Vá no omakase do chef — peixe do dia, decisão dele.'
	},
	{
		id: 'tokyo-ichiran',
		destinoId: 'tokyo',
		nome: 'Ichiran Shibuya',
		especialidade: 'Tonkotsu ramen em booth individual',
		faixaPreco: 'baixo',
		precoMedio: '¥1.200-1.800 / pessoa',
		bairro: 'Shibuya',
		notaLocal: 'A cabine isola você do mundo — comer ramen sozinho como ritual. Aponte tudo no formulário.'
	},
	{
		id: 'tokyo-ginza-kojyu',
		destinoId: 'tokyo',
		nome: 'Ginza Kojyu',
		especialidade: 'Kaiseki estrelado Michelin',
		faixaPreco: 'alto',
		precoMedio: '¥30.000-50.000 / pessoa',
		bairro: 'Ginza',
		notaLocal: 'Reserva 1 mês antes via concierge do hotel. ~12 cursos. Conta pesa, memória fica.'
	},
	{
		id: 'tokyo-fuunji',
		destinoId: 'tokyo',
		nome: 'Fuunji',
		especialidade: 'Tsukemen (ramen de molho separado)',
		faixaPreco: 'baixo',
		precoMedio: '¥1.100-1.500 / pessoa',
		bairro: 'Shinjuku (Yoyogi)',
		notaLocal: 'Caldo grosso de peixe + porco. Compre ticket na máquina antes — não tem cardápio em mesa.'
	},

	// === Osaka ===
	{
		id: 'osaka-mizuno',
		destinoId: 'osaka',
		nome: 'Mizuno',
		especialidade: 'Okonomiyaki estilo Osaka, casa centenária',
		faixaPreco: 'medio',
		precoMedio: '¥1.500-2.500 / pessoa',
		bairro: 'Dotonbori',
		notaLocal: 'Estrelado Michelin. Peça "Yamaimo-yaki" — panqueca com inhame ralado, mais fofa.'
	},
	{
		id: 'osaka-daruma',
		destinoId: 'osaka',
		nome: 'Daruma',
		especialidade: 'Kushikatsu (espetinhos empanados)',
		faixaPreco: 'baixo',
		precoMedio: '¥1.500-3.000 / pessoa',
		bairro: 'Shinsekai',
		notaLocal: 'Regra absoluta: nunca molhe duas vezes no molho compartilhado. Use repolho como colher.'
	},
	{
		id: 'osaka-endo-sushi',
		destinoId: 'osaka',
		nome: 'Endo Sushi',
		especialidade: 'Sushi de café da manhã (5h-14h só)',
		faixaPreco: 'medio',
		precoMedio: '¥600-1.500 / pessoa',
		bairro: 'Mercado Osaka Central',
		notaLocal: 'Set de 5 peças por ¥600. Peça 2-3 sets — peixe direto do leilão a 2 quarteirões.'
	},
	{
		id: 'osaka-kani-doraku',
		destinoId: 'osaka',
		nome: 'Kani Doraku Honten',
		especialidade: 'Caranguejo em todas as formas',
		faixaPreco: 'alto',
		precoMedio: '¥5.000-12.000 / pessoa',
		bairro: 'Dotonbori',
		notaLocal: 'É o restaurante do caranguejo gigante mecânico. Turístico mas o caranguejo é genuíno.'
	},

	// === Hakone ===
	{
		id: 'hakone-hatsuhana',
		destinoId: 'hakone',
		nome: 'Hatsuhana Soba',
		especialidade: 'Soba tradicional à beira-rio',
		faixaPreco: 'medio',
		precoMedio: '¥1.500-2.500 / pessoa',
		bairro: 'Hakone-Yumoto',
		notaLocal: 'Peça "Seiro Soba" frio. A vista do rio Haya pela janela vale o desvio.'
	},
	{
		id: 'hakone-itoh-dining',
		destinoId: 'hakone',
		nome: 'Itoh Dining by Nobu',
		especialidade: 'Wagyu grelhado na hora + sushi fusion',
		faixaPreco: 'alto',
		precoMedio: '¥15.000-25.000 / pessoa',
		bairro: 'Gora',
		notaLocal: 'Vista do Fuji em dias claros. Reserve a janela — ¥15-20K, mas o teppan é executado na sua frente.'
	},
	{
		id: 'hakone-tamura-ginkatsu',
		destinoId: 'hakone',
		nome: 'Tamura Ginkatsu-tei',
		especialidade: 'Tonkatsu de tofu + carne',
		faixaPreco: 'medio',
		precoMedio: '¥1.500-2.500 / pessoa',
		bairro: 'Hakone-Yumoto',
		notaLocal: 'A mistura tofu+porco virou marca registrada. Casa pequena, ~12 lugares.'
	},
	{
		id: 'hakone-ryokan-kaiseki',
		destinoId: 'hakone',
		nome: 'Refeição em ryokan (kaiseki)',
		especialidade: 'Kaiseki multi-curso servido no quarto',
		faixaPreco: 'alto',
		precoMedio: '¥10.000-25.000 / pessoa',
		bairro: 'Variado (Gora, Sengokuhara)',
		notaLocal: 'Inclusa no pacote do ryokan. Peixes e vegetais regionais, apresentação ritual.'
	},

	// === Nara ===
	{
		id: 'nara-tsukihitei',
		destinoId: 'nara',
		nome: 'Tsukihitei',
		especialidade: 'Kaiseki em casa antiga isolada na floresta',
		faixaPreco: 'alto',
		precoMedio: '¥10.000-20.000 / pessoa',
		bairro: 'Atrás do Kasuga Taisha',
		notaLocal: 'Caminhada de 15 min pela floresta sagrada até a casa. Reserva difícil — vale a paciência.'
	},
	{
		id: 'nara-nakatanidou',
		destinoId: 'nara',
		nome: 'Nakatanidou',
		especialidade: 'Mochi-tsuki batido na hora (yomogi mochi)',
		faixaPreco: 'baixo',
		precoMedio: '¥200 / unidade',
		bairro: 'Naramachi',
		notaLocal: 'Pare e veja o show da batida — 2 caras, ritmo absurdo. Coma ainda quente, melado de soja.'
	},
	{
		id: 'nara-edogawa',
		destinoId: 'nara',
		nome: 'Edogawa',
		especialidade: 'Unagi (enguia grelhada) tradicional',
		faixaPreco: 'medio',
		precoMedio: '¥3.000-5.000 / pessoa',
		bairro: 'Naramachi',
		notaLocal: 'Casa de 100 anos. Hitsumabushi — eat-3-ways da enguia. Peça com bastante shichimi.'
	},
	{
		id: 'nara-yume-kaze',
		destinoId: 'nara',
		nome: 'Yume-kaze Hiroba',
		especialidade: 'Café com terraço, vista de cervos',
		faixaPreco: 'baixo',
		precoMedio: '¥1.000-2.000 / pessoa',
		bairro: 'Perto do Todai-ji',
		notaLocal: 'Comida casual mas a localização é o ponto. Cervos podem aparecer perto da mesa.'
	},

	// === Kanazawa ===
	{
		id: 'kanazawa-itaru-honten',
		destinoId: 'kanazawa',
		nome: 'Itaru Honten',
		especialidade: 'Izakaya de peixe local',
		faixaPreco: 'medio',
		precoMedio: '¥3.000-6.000 / pessoa',
		bairro: 'Centro',
		notaLocal: 'Caranguejo de neve em temporada (nov-mar). Sashimi do Mar do Japão — diferente do Pacífico.'
	},
	{
		id: 'kanazawa-champion-curry',
		destinoId: 'kanazawa',
		nome: 'Champion Curry',
		especialidade: 'Curry estilo Kanazawa (denso, escuro, doce)',
		faixaPreco: 'baixo',
		precoMedio: '¥800-1.200 / pessoa',
		bairro: 'Korinbo',
		notaLocal: 'Tradição local, não confundir com curry indiano. Topping clássico: katsu + repolho.'
	},
	{
		id: 'kanazawa-omicho-2f',
		destinoId: 'kanazawa',
		nome: 'Omicho Mercado — andar 2',
		especialidade: 'Kaisen-don (tigela de sashimi misto)',
		faixaPreco: 'medio',
		precoMedio: '¥2.000-4.000 / pessoa',
		bairro: 'Omicho',
		notaLocal: 'Várias opções no 2º andar — escolha pela vibe. Peça uni se for temporada.'
	},
	{
		id: 'kanazawa-tsubajin',
		destinoId: 'kanazawa',
		nome: 'Tsubajin',
		especialidade: 'Jibu-ni (frango+tofu refogado, prato local)',
		faixaPreco: 'medio',
		precoMedio: '¥3.000-6.000 / pessoa',
		bairro: 'Kazuemachi',
		notaLocal: 'Bairro de chayagai antigo (gueixas). Set lunch sai mais em conta que jantar.'
	},

	// === Hiroshima ===
	{
		id: 'hiroshima-hassei',
		destinoId: 'hiroshima',
		nome: 'Okonomiyaki Hassei',
		especialidade: 'Okonomi clássico Hiroshima-style',
		faixaPreco: 'medio',
		precoMedio: '¥1.000-1.800 / pessoa',
		bairro: 'Centro',
		notaLocal: 'Lendário desde 1957. Camadas: massa fina + repolho + soba + ovo, montagem na chapa.'
	},
	{
		id: 'hiroshima-tomohan',
		destinoId: 'hiroshima',
		nome: 'Tomohan',
		especialidade: 'Okonomi de bairro, sem turistas',
		faixaPreco: 'baixo',
		precoMedio: '¥800-1.500 / pessoa',
		bairro: 'Funairi',
		notaLocal: 'Fila de locais, não de turismo. Sente no balcão e veja a chapa por 15 min.'
	},
	{
		id: 'hiroshima-kaki-tei',
		destinoId: 'hiroshima',
		nome: 'Kaki-tei',
		especialidade: 'Ostras em todas as formas',
		faixaPreco: 'medio',
		precoMedio: '¥3.000-6.000 / pessoa',
		bairro: 'Naka-ku',
		notaLocal: 'Hiroshima produz 60% das ostras do Japão. Peça o "Kaki Furai Set" — frita perfeita.'
	},
	{
		id: 'hiroshima-kanawa',
		destinoId: 'hiroshima',
		nome: 'Kanawa',
		especialidade: 'Restaurante-barco de ostras',
		faixaPreco: 'alto',
		precoMedio: '¥10.000-20.000 / pessoa',
		bairro: 'Heiwa-Odori',
		notaLocal: 'Embarcação flutuante no rio. Kaiseki de ostras em 8-10 cursos. Reserve com semanas.'
	},

	// === Nikko ===
	{
		id: 'nikko-hippari-dako',
		destinoId: 'nikko',
		nome: 'Hippari Dako',
		especialidade: 'Yuba (pele de tofu) + yakitori',
		faixaPreco: 'baixo',
		precoMedio: '¥1.000-1.800 / pessoa',
		bairro: 'Caminho pra Tosho-gu',
		notaLocal: 'Paredes inteiras cobertas de cartões de visita de turistas. Casa minúscula, fila rápida.'
	},
	{
		id: 'nikko-gyoshintei',
		destinoId: 'nikko',
		nome: 'Gyoshintei',
		especialidade: 'Shojin ryori (cozinha vegetariana budista)',
		faixaPreco: 'alto',
		precoMedio: '¥5.000-8.000 / pessoa',
		bairro: 'Perto do Tosho-gu',
		notaLocal: 'Cozinha de templo: zero carne/peixe, foco em yuba e cogumelos. Apresentação meticulosa.'
	},
	{
		id: 'nikko-meiji-no-yakata',
		destinoId: 'nikko',
		nome: 'Meiji-no-Yakata',
		especialidade: 'Comida ocidental tradicional Meiji-era',
		faixaPreco: 'medio',
		precoMedio: '¥3.000-6.000 / pessoa',
		bairro: 'Área dos hotéis históricos',
		notaLocal: 'Beef stew clássico em casarão de 1900. Sente na varanda envidraçada com vista de jardim.'
	},
	{
		id: 'nikko-yuba-suzuki',
		destinoId: 'nikko',
		nome: 'Yuba Ryori Suzuki',
		especialidade: 'Yuba multi-curso, especialidade local',
		faixaPreco: 'medio',
		precoMedio: '¥3.000-6.000 / pessoa',
		bairro: 'Centro',
		notaLocal: 'Yuba é a "pele" formada na superfície do leite de soja fervido. Refinada, etérea.'
	},

	// === Takayama ===
	{
		id: 'takayama-kakushou',
		destinoId: 'takayama',
		nome: 'Kakushou',
		especialidade: 'Hida wagyu kaiseki',
		faixaPreco: 'alto',
		precoMedio: '¥8.000-15.000 / pessoa',
		bairro: 'Bairro antigo',
		notaLocal: 'Hida beef tem A5-rank. Sente no irori (lareira de carvão) e cozinhe na grade da casa.'
	},
	{
		id: 'takayama-center4',
		destinoId: 'takayama',
		nome: 'Center4 Hamburgers',
		especialidade: 'Burger gourmet de Hida wagyu',
		faixaPreco: 'medio',
		precoMedio: '¥1.800-3.000 / pessoa',
		bairro: 'Hirokoji',
		notaLocal: 'Casa de mesa única, ambiente americano-anos-50. O burger é absurdamente macio.'
	},
	{
		id: 'takayama-sumiyoshi',
		destinoId: 'takayama',
		nome: 'Sumiyoshi',
		especialidade: 'Soba feita à mão na hora',
		faixaPreco: 'medio',
		precoMedio: '¥1.500-2.500 / pessoa',
		bairro: 'Kami-Sannomachi',
		notaLocal: 'Casa Edo de 200 anos. Veja o mestre fazendo a massa na vitrine antes de entrar.'
	},
	{
		id: 'takayama-funasaka',
		destinoId: 'takayama',
		nome: 'Funasaka Sake Brewery',
		especialidade: 'Saquê + comida da casa',
		faixaPreco: 'medio',
		precoMedio: '¥3.000-5.000 / pessoa',
		bairro: 'Sannomachi',
		notaLocal: 'Cervejaria + restaurante. Set de degustação de saquê (5 copos por ¥500).'
	},

	// === Miyajima ===
	{
		id: 'miyajima-yakigaki-hayashi',
		destinoId: 'miyajima',
		nome: 'Yakigaki no Hayashi',
		especialidade: 'Ostras grelhadas na casca',
		faixaPreco: 'medio',
		precoMedio: '¥2.500-4.500 / pessoa',
		bairro: 'Omotesando',
		notaLocal: 'Peça as ostras grelhadas + sashimi. Vista pra rua principal — pico das 11h-14h.'
	},
	{
		id: 'miyajima-anago-ueno',
		destinoId: 'miyajima',
		nome: 'Anago-meshi Ueno',
		especialidade: 'Anago (enguia marinha) sobre arroz',
		faixaPreco: 'medio',
		precoMedio: '¥2.500-3.500 / pessoa',
		bairro: 'Estação JR Miyajima-guchi (continente)',
		notaLocal: 'Casa centenária. Anago é diferente de unagi — mais leve, doce. A bento pra viagem dura horas.'
	},
	{
		id: 'miyajima-tachibana',
		destinoId: 'miyajima',
		nome: 'Tachibana',
		especialidade: 'Tendon (tempura sobre arroz)',
		faixaPreco: 'baixo',
		precoMedio: '¥1.200-2.000 / pessoa',
		bairro: 'Omotesando',
		notaLocal: 'Casa simples, fila rápida. Tendon de anago é a versão local do prato.'
	},
	{
		id: 'miyajima-iwamuraya',
		destinoId: 'miyajima',
		nome: 'Iwamuraya',
		especialidade: 'Momiji-manjū (bolinho com formato de bordo)',
		faixaPreco: 'baixo',
		precoMedio: '¥150-300 / unidade',
		bairro: 'Omotesando',
		notaLocal: 'Doce assinatura da ilha. Recheios variados — o de creme é traidor (parece doce de leite).'
	},

	// === Okinawa ===
	{
		id: 'okinawa-yunangi',
		destinoId: 'okinawa',
		nome: 'Yunangi',
		especialidade: 'Comida tradicional Okinawana',
		faixaPreco: 'medio',
		precoMedio: '¥2.000-3.500 / pessoa',
		bairro: 'Naha (Kumoji)',
		notaLocal: 'Goya champuru, rafute (porco refogado), awamori. Cardápio só em japonês — aponte na mesa do lado.'
	},
	{
		id: 'okinawa-eibun',
		destinoId: 'okinawa',
		nome: 'Okinawa Soba Eibun',
		especialidade: 'Soba Okinawa-style (macarrão grosso, caldo de porco)',
		faixaPreco: 'baixo',
		precoMedio: '¥800-1.200 / pessoa',
		bairro: 'Yamatocho, Naha',
		notaLocal: 'Diferente do soba do continente — é mais parecido com udon. Peça com soki (costela).'
	},
	{
		id: 'okinawa-nakamura-soba',
		destinoId: 'okinawa',
		nome: 'Nakamura Soba',
		especialidade: 'Soba Okinawano com vista do mar',
		faixaPreco: 'medio',
		precoMedio: '¥1.500-2.500 / pessoa',
		bairro: 'Onna (oeste da ilha)',
		notaLocal: 'Vale o desvio: terraço sobre o oceano enquanto come. Lotado nos finais de semana.'
	},
	{
		id: 'okinawa-charlie-tacos',
		destinoId: 'okinawa',
		nome: "Charlie's Tacos",
		especialidade: 'Taco-rice (invenção pós-base americana)',
		faixaPreco: 'baixo',
		precoMedio: '¥800-1.500 / pessoa',
		bairro: 'Kin (norte da ilha)',
		notaLocal: 'O taco-rice nasceu aqui — taco em cima de arroz. Casca dura, queijo cheddar, alface.'
	},

	// === Sapporo ===
	{
		id: 'sapporo-menya-saimi',
		destinoId: 'sapporo',
		nome: 'Menya Saimi',
		especialidade: 'Ramen miso (estilo Sapporo definitivo)',
		faixaPreco: 'medio',
		precoMedio: '¥1.000-1.500 / pessoa',
		bairro: 'Sumikawa (sul)',
		notaLocal: 'Classificado top-3 do Japão por críticos locais. Vale o táxi — nada do centro chega perto.'
	},
	{
		id: 'sapporo-sushi-zen',
		destinoId: 'sapporo',
		nome: 'Sushi Zen',
		especialidade: 'Sushi premium com peixe de Hokkaido',
		faixaPreco: 'alto',
		precoMedio: '¥10.000-20.000 / pessoa',
		bairro: 'Susukino',
		notaLocal: 'Uni e botan ebi (camarão doce) direto do Mar de Okhotsk. Reserve omakase.'
	},
	{
		id: 'sapporo-daruma',
		destinoId: 'sapporo',
		nome: 'Genghis Khan Daruma',
		especialidade: 'Cordeiro grelhado em chapa cônica',
		faixaPreco: 'medio',
		precoMedio: '¥3.000-5.000 / pessoa',
		bairro: 'Susukino',
		notaLocal: 'Tradição local — você grelha o cordeiro na sua mesa. Pula o jantar formal e venha aqui.'
	},
	{
		id: 'sapporo-takinosawaya',
		destinoId: 'sapporo',
		nome: 'Takinosawaya',
		especialidade: 'Kaisen-don (tigela de sashimi)',
		faixaPreco: 'medio',
		precoMedio: '¥2.500-4.500 / pessoa',
		bairro: 'Próximo Mercado Nijo',
		notaLocal: 'Tigela vai-para-fora-da-tigela: caranguejo, uni, ikura, atum. Almoço-festival.'
	},

	// === Kamakura ===
	{
		id: 'kamakura-bowls',
		destinoId: 'kamakura',
		nome: 'Bowls Donburi Cafe',
		especialidade: 'Donburi vegetariano contemporâneo',
		faixaPreco: 'baixo',
		precoMedio: '¥1.200-1.800 / pessoa',
		bairro: 'Komachi-dori',
		notaLocal: 'Pequeno, bonito, sem fila grande. Peça o "Tofu Donburi" com molho de gergelim.'
	},
	{
		id: 'kamakura-yorozuya',
		destinoId: 'kamakura',
		nome: 'Yorozuya',
		especialidade: 'Shirasu-don (sardinhas brancas no arroz)',
		faixaPreco: 'baixo',
		precoMedio: '¥1.200-1.800 / pessoa',
		bairro: 'Komachi-dori',
		notaLocal: 'Shirasu é a especialidade da costa. Peça com o "ni-shoku" — meio cru, meio cozido.'
	},
	{
		id: 'kamakura-wakana',
		destinoId: 'kamakura',
		nome: 'Wakana',
		especialidade: 'Café Showa-era, pâtés caseiros',
		faixaPreco: 'baixo',
		precoMedio: '¥1.000-1.800 / pessoa',
		bairro: 'Yuigahama',
		notaLocal: 'Vibe surf-velho-Kamakura, cheio de surfistas pós-praia. Pâté + pão grelhado simples e perfeito.'
	},
	{
		id: 'kamakura-nakamura-an',
		destinoId: 'kamakura',
		nome: 'Nakamura-an',
		especialidade: 'Soba feita à mão',
		faixaPreco: 'medio',
		precoMedio: '¥1.500-2.500 / pessoa',
		bairro: 'Perto Tsurugaoka Hachimangu',
		notaLocal: 'Casa antiga com tatame, jardinzinho privado. Peça o "kamo-nanban soba" (com pato).'
	},

	// === Beppu ===
	{
		id: 'beppu-toyotsune',
		destinoId: 'beppu',
		nome: 'Toyotsune Honten',
		especialidade: 'Tendon (tempura sobre arroz) local',
		faixaPreco: 'medio',
		precoMedio: '¥1.500-2.500 / pessoa',
		bairro: 'Estação Beppu',
		notaLocal: 'Casa de 80 anos. O ten-don gigante é absurdo — 5 camarões + legumes empilhados.'
	},
	{
		id: 'beppu-jigoku-mushi-kobo',
		destinoId: 'beppu',
		nome: 'Jigoku-mushi Kobo',
		especialidade: 'Você cozinha sua comida no vapor termal',
		faixaPreco: 'baixo',
		precoMedio: '¥1.500-3.000 / pessoa',
		bairro: 'Kannawa',
		notaLocal: 'Reserve 1h antes. Pegue o cesto com legumes/camarão/ovo e cozinhe no vapor — 15-25 min.'
	},
	{
		id: 'beppu-tomonaga',
		destinoId: 'beppu',
		nome: 'Tomonaga Pan-ya',
		especialidade: 'Padaria centenária — pães doces clássicos',
		faixaPreco: 'baixo',
		precoMedio: '¥200-500 / item',
		bairro: 'Centro de Beppu',
		notaLocal: 'O cream pan é icônico desde 1916. Tome com café da manhã antes do tour dos infernos.'
	},
	{
		id: 'beppu-yufuin-floral',
		destinoId: 'beppu',
		nome: 'Restaurantes da vila Yufuin',
		especialidade: 'Café/almoço casual em vilarejo de onsen',
		faixaPreco: 'medio',
		precoMedio: '¥1.500-3.000 / pessoa',
		bairro: 'Yufuin (day-trip)',
		notaLocal: 'Pegue o trem panorâmico Yufuin-no-mori. A vila é cheia de cafés temáticos pequenos.'
	}
];

export function restaurantesPorDestino(destinoId: string): Restaurante[] {
	return RESTAURANTES.filter((r) => r.destinoId === destinoId);
}
