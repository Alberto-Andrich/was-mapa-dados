/* WAS · mini mapa interativo da seção "Mapa da WAS" das páginas (guias de destinos e territórios).
   Pedido do Alberto (26/11/2026): mesmo acabamento do Mapa da aventura, simplificado, sem menus.
   Ativa em <figure class="ds-fig-map" data-mm='{...}'>. Configuração (JSON):
     k   letra da camada do assunto (G mergulho, T trekkings, C cumes, Z vulcões, Q atividades, W fauna, H naufrágios, B baleias,
         L grandes trilhas, P polos, X travessias, K bike, O off-road, V expedições)
     g   (opcional) grupos da camada que ficam ligados, ex. ["ar"] = só voo livre e balão
     p   nome do ponto da página na camada (como no mapa), ou c:[lng,lat,"Nome"] quando não há ponto na camada
     pts pontos citados no texto: [lng,lat,"Nome","cid"|"poi"]
     lin traçados citados: [{n:"Nome",c:"#cor",t:"line"|"dash",p:[[lng,lat],...]}]
     rot (opcional) ids de rotas do mapa-rotas.json
     bb  (opcional) [oeste,leste,sul,norte] da vista local
   Fonte: /mnt/project-files/mapa-aventura/mini-mapa/src/mini.js (build.py gera o asset). */
(function(){
'use strict';
// configuração por página: atributo data-mm na figura ou tabela CFG pelo slug da URL (gerada por config_paginas.py)
const CFG={"antarctica":[{"k":"P","p":"Polo Sul geográfico","pol":1,"globo":[-60,-85],"gz":0.9,"gzc":2.2,"kt":{"pt":"Citado na reportagem","en":"Mentioned in this story","es":"Citado en el reportaje"},"pts":[[166.67,-77.85,{"pt":"McMurdo","en":"McMurdo","es":"McMurdo"},"poi"],[106.8,-78.46,{"pt":"Vostok","en":"Vostok","es":"Vostok"},"poi"],[-58.39,-62.08,{"pt":"Comandante Ferraz","en":"Comandante Ferraz","es":"Comandante Ferraz"},"poi"],[-60.65,-62.97,{"pt":"Ilha Deception","en":"Deception Island","es":"Isla Decepción"},"poi"],[-63.49,-64.83,{"pt":"Port Lockroy","en":"Port Lockroy","es":"Port Lockroy"},"poi"],[-68.3,-54.8,{"pt":"Ushuaia","en":"Ushuaia","es":"Ushuaia"},"cid"],[-85.617,-78.525,{"pt":"Maciço Vinson","en":"Vinson Massif","es":"Macizo Vinson"},"poi"],[167.15,-77.53,{"pt":"Monte Erebus","en":"Mount Erebus","es":"Monte Erebus"},"poi"],[-106.75,-75.5,{"pt":"Geleira Thwaites","en":"Thwaites Glacier","es":"Glaciar Thwaites"},"poi"],[-55.1,-61.1,{"pt":"Ilha Elefante","en":"Elephant Island","es":"Isla Elefante"},"poi"],[170.27,-71.3,{"pt":"Cabo Adare","en":"Cape Adare","es":"Cabo Adare"},"poi"],[-175,-81.2,{"pt":"Plataforma de Ross","en":"Ross Ice Shelf","es":"Barrera de hielo de Ross"},"poi"],[-55,-79.6,{"pt":"Plataforma Filchner-Ronne","en":"Filchner-Ronne Ice Shelf","es":"Barrera de hielo Filchner-Ronne"},"poi"],[150,-84.5,{"pt":"Montes Transantárticos","en":"Transantarctic Mountains","es":"Montes Transantárticos"},"poi"]]},{"k":"P","p":"Polo Sul geográfico","pol":1,"globo":[180,-83.5],"gz":2.9,"gzc":3.2,"ord":1,"kt":{"pt":"Corrida ao Polo Sul","en":"Race to the South Pole","es":"Carrera al Polo Sur"},"lin":[{"n":{"pt":"Amundsen, 1911: Polo em 14 de dezembro","en":"Amundsen, 1911: Pole on 14 December","es":"Amundsen, 1911: Polo el 14 de diciembre"},"lg":{"pt":"Amundsen","en":"Amundsen","es":"Amundsen"},"c":"#d9b44a","t":"line","p":[[-163.6,-78.5],[-163.6,-80],[-163.7,-81],[-163.8,-82],[-164.5,-83],[-165.5,-84],[-166.5,-84.8],[-167.6,-85.25],[-168.3,-85.8],[-167,-86.5],[-162,-87.5],[-150,-88.6],[-140,-89.5],[-140,-89.95]]},{"n":{"pt":"Scott, 1911–1912: Polo em 17 de janeiro","en":"Scott, 1911–1912: Pole on 17 January","es":"Scott, 1911–1912: Polo el 17 de enero"},"lg":{"pt":"Scott","en":"Scott","es":"Scott"},"c":"#6fc3ff","t":"line","p":[[166.42,-77.64],[167.6,-78.5],[168.8,-79.48],[169.8,-80.8],[170.6,-82],[171.3,-83.3],[171.6,-83.6],[171.0,-84.3],[169.0,-85.1],[163,-86.0],[160,-87],[160,-88],[163,-88.8],[166,-89.5],[166,-89.95]]},{"n":{"pt":"Shackleton, 1908–1909: até 88°23′ S","en":"Shackleton, 1908–1909: to 88°23′ S","es":"Shackleton, 1908–1909: hasta 88°23′ S"},"lg":{"pt":"Shackleton","en":"Shackleton","es":"Shackleton"},"c":"#b49cff","t":"dash","p":[[166.17,-77.55],[167.6,-78.5],[168.5,-79.5],[169.6,-80.8],[170.5,-82],[171.2,-83.3],[171.5,-83.6],[171.0,-84.3],[169.5,-85.0],[166,-85.8],[163,-86.6],[162,-87.5],[162,-88.38]]}],"pts":[[166.17,-77.55,{"pt":"Cabo Royds","en":"Cape Royds","es":"Cabo Royds"},"poi",{"pt":"Base de Shackleton, 1908","en":"Shackleton’s base, 1908","es":"Base de Shackleton, 1908"}],[162,-88.38,{"pt":"88°23′ S","en":"88°23′ S","es":"88°23′ S"},"poi",{"pt":"Shackleton volta a 180 km do Polo, 9 jan. 1909","en":"Shackleton turns back 180 km from the Pole, 9 Jan. 1909","es":"Shackleton regresa a 180 km del Polo, 9 ene. 1909"}],[-163.6,-78.5,{"pt":"Framheim","en":"Framheim","es":"Framheim"},"poi",{"pt":"Base de Amundsen, na baía das Baleias","en":"Amundsen’s base, Bay of Whales","es":"Base de Amundsen, bahía de las Ballenas"}],[166.42,-77.64,{"pt":"Cabo Evans","en":"Cape Evans","es":"Cabo Evans"},"poi",{"pt":"Base de Scott, 1911","en":"Scott’s base, 1911","es":"Base de Scott, 1911"}],[169.1,-79.48,{"pt":"One Ton Depot","en":"One Ton Depot","es":"One Ton Depot"},"poi",{"pt":"Depósito de Scott que o grupo não alcançou","en":"Scott’s depot the party never reached","es":"Depósito de Scott que el grupo no alcanzó"}],[169.4,-79.67,{"pt":"Última barraca de Scott","en":"Scott’s last tent","es":"Última tienda de Scott"},"poi",{"pt":"Março de 1912, a 18 km do depósito","en":"March 1912, 18 km from the depot","es":"Marzo de 1912, a 18 km del depósito"}]]},{"k":"P","pol":1,"globo":[-42,-66],"gz":2.2,"gzc":2.8,"ord":1,"kt":{"pt":"Expedição Endurance","en":"Endurance expedition","es":"Expedición Endurance"},"lin":[{"n":{"pt":"Ida do Endurance, dez. 1914 a jan. 1915","en":"Endurance outbound, Dec. 1914 to Jan. 1915","es":"Ida del Endurance, dic. 1914 a ene. 1915"},"lg":{"pt":"Ida","en":"Outbound","es":"Ida"},"c":"#9aa3ad","t":"dash","p":[[-36.5,-54.28],[-30,-57],[-27,-59.5],[-24,-65],[-22,-70],[-25,-74],[-31.5,-76.6]]},{"n":{"pt":"Deriva no gelo, jan. 1915 a abr. 1916","en":"Drift in the ice, Jan. 1915 to Apr. 1916","es":"Deriva en el hielo, ene. 1915 a abr. 1916"},"lg":{"pt":"Deriva","en":"Drift","es":"Deriva"},"c":"#6fc3ff","t":"dash","p":[[-31.5,-76.6],[-35,-76.4],[-40,-75.5],[-43,-74],[-46,-72.5],[-49,-70.8],[-51,-69.5],[-52.4,-68.65],[-52.9,-67.5],[-53.5,-65],[-53.2,-62.4]]},{"n":{"pt":"Botes até a ilha Elefante, abr. 1916","en":"Boats to Elephant Island, Apr. 1916","es":"Botes hasta la isla Elefante, abr. 1916"},"lg":{"pt":"Botes","en":"Boats","es":"Botes"},"c":"#d9b44a","t":"line","p":[[-53.2,-62.4],[-54.2,-62.0],[-55.0,-61.4],[-54.9,-61.1]]},{"n":{"pt":"James Caird até a Geórgia do Sul, 1.300 km","en":"James Caird to South Georgia, 1,300 km","es":"James Caird hasta Georgia del Sur, 1.300 km"},"lg":{"pt":"James Caird","en":"James Caird","es":"James Caird"},"c":"#ff5a4a","t":"line","p":[[-54.9,-61.1],[-52,-60.2],[-47,-58.5],[-42,-56.4],[-38.6,-54.6],[-37.6,-54.15]]}],"pts":[[-36.6,-54.4,{"pt":"Geórgia do Sul","en":"South Georgia","es":"Georgia del Sur"},"poi",{"pt":"Partida em 5 dez. 1914","en":"Departure, 5 Dec. 1914","es":"Salida, 5 dic. 1914"}],[-31.5,-76.6,{"pt":"Preso no gelo","en":"Beset in the ice","es":"Atrapado en el hielo"},"poi",{"pt":"Janeiro de 1915","en":"January 1915","es":"Enero de 1915"}],[-52.4,-68.65,{"pt":"Naufrágio do Endurance","en":"Endurance sinks","es":"Naufragio del Endurance"},"poi",{"pt":"21 nov. 1915; destroços achados em 2022","en":"21 Nov. 1915; wreck found in 2022","es":"21 nov. 1915; restos hallados en 2022"}],[-54.9,-61.1,{"pt":"Ilha Elefante","en":"Elephant Island","es":"Isla Elefante"},"poi",{"pt":"Abril a agosto de 1916","en":"April to August 1916","es":"Abril a agosto de 1916"}],[-37.6,-54.15,{"pt":"Baía Rei Haakon","en":"King Haakon Bay","es":"Bahía Rey Haakon"},"poi",{"pt":"Chegada do James Caird, 10 maio 1916","en":"James Caird lands, 10 May 1916","es":"Llegada del James Caird, 10 mayo 1916"}]]}],"borge-ousland":[{"k":"P","pol":1,"globo":[-100,85],"gz":0.75,"gzc":1.6,"ord":1,"kt":{"pt":"Expedições de Ousland","en":"Ousland’s expeditions","es":"Expediciones de Ousland"},"lin":[{"n":{"pt":"1990: com Erling Kagge, primeira chegada ao polo sem apoio","en":"1990: with Erling Kagge, first unsupported trip to the Pole","es":"1990: con Erling Kagge, primera llegada al polo sin apoyo"},"lg":{"pt":"1990","en":"1990","es":"1990"},"c":"#9be15d","t":"dash","p":[[-101.5,78.9],[-97,81.5],[-88,84.5],[-70,87.5],[0,89.97]]},{"n":{"pt":"1994: primeiro a chegar sozinho e sem apoio ao Polo Norte","en":"1994: first to reach the North Pole solo and unsupported","es":"1994: primero en llegar solo y sin apoyo al Polo Norte"},"lg":{"pt":"1994","en":"1994","es":"1994"},"c":"#e8d27a","t":"line","p":[[95.7,81.25],[93,83.5],[85,86],[60,88.5],[0,89.97]]},{"n":{"pt":"2001: travessia solitária do Oceano Ártico, da Sibéria ao Canadá","en":"2001: solo crossing of the Arctic Ocean, Siberia to Canada","es":"2001: travesía solitaria del océano Ártico, de Siberia a Canadá"},"lg":{"pt":"2001","en":"2001","es":"2001"},"c":"#ff5a4a","t":"line","p":[[95.7,81.25],[100,83.5],[105,86],[120,88.6],[0,89.97],[-75,88],[-74.5,85.5],[-74.1,83.1]]},{"n":{"pt":"2010: volta ao Ártico de barco pelas passagens Nordeste e Noroeste","en":"2010: round the Arctic by boat via the Northeast and Northwest Passages","es":"2010: vuelta al Ártico en barco por los pasos del Nordeste y del Noroeste"},"lg":{"pt":"2010","en":"2010","es":"2010"},"c":"#5ec8ff","t":"dash","p":[[10.75,59.9],[5,62.5],[14,68.5],[25,71.2],[40,70.5],[55,71.5],[66,73.5],[80,74.5],[100,77.7],[115,76],[130,73.8],[150,72.5],[165,70],[175,66.8],[191,65.8],[203.2,71.4],[220,70.2],[235,69.8],[250,68.6],[264.1,68.6],[268,72.5],[278,74.2],[292,73.5],[302,69],[314,62],[325,60.2],[340,61.5],[355,61],[370.75,59.9]]}],"pts":[[-101.5,78.9,{"pt":"Ilha Ellef Ringnes","en":"Ellef Ringnes Island","es":"Isla Ellef Ringnes"},"poi",{"pt":"Partida em 1990","en":"Start, 1990","es":"Salida, 1990"},{"pt":"Daqui Ousland e Erling Kagge partiram em 1990 e chegaram ao Polo Norte sem reabastecimento, puxando trenós.","en":"From here Ousland and Erling Kagge set out in 1990 and reached the North Pole without resupply, hauling sledges.","es":"Desde aquí Ousland y Erling Kagge partieron en 1990 y llegaron al Polo Norte sin reabastecimiento, tirando de trineos."}],[95.7,81.25,{"pt":"Cabo Arktichesky","en":"Cape Arktichesky","es":"Cabo Arktichesky"},"poi",{"pt":"Severnaya Zemlya · partida em 1994 e 2001","en":"Severnaya Zemlya · start in 1994 and 2001","es":"Severnaya Zemlya · salida en 1994 y 2001"},{"pt":"O ponto mais ao norte da Sibéria. Daqui ele saiu sozinho rumo ao polo em 1994 e para a travessia inteira do Oceano Ártico em 2001.","en":"The northernmost point of Siberia. He left from here alone for the Pole in 1994 and for the full crossing of the Arctic Ocean in 2001.","es":"El punto más septentrional de Siberia. De aquí salió solo hacia el polo en 1994 y para la travesía completa del océano Ártico en 2001."}],[-74.1,83.1,{"pt":"Ilha Ward Hunt","en":"Ward Hunt Island","es":"Isla Ward Hunt"},"poi",{"pt":"Chegada em 2001","en":"Finish, 2001","es":"Llegada, 2001"},{"pt":"No extremo norte do Canadá, foi o fim da travessia solitária de 2001, que começou na Sibéria e passou pelo Polo Norte.","en":"At Canada’s northern tip, this was the end of the 2001 solo crossing, which began in Siberia and passed over the North Pole.","es":"En el extremo norte de Canadá, fue el final de la travesía solitaria de 2001, que empezó en Siberia y pasó por el Polo Norte."}],[10.75,59.9,{"pt":"Oslo","en":"Oslo","es":"Oslo"},"cid",{"pt":"Partida e chegada em 2010","en":"Start and finish, 2010","es":"Salida y llegada, 2010"},{"pt":"Em 2010, Ousland e Thorleif Thorleifsson saíram de Oslo no barco Northern Passage e voltaram depois de contornar o Ártico numa só temporada.","en":"In 2010 Ousland and Thorleif Thorleifsson sailed from Oslo in the boat Northern Passage and returned after rounding the Arctic in a single season.","es":"En 2010, Ousland y Thorleif Thorleifsson salieron de Oslo en el barco Northern Passage y volvieron tras rodear el Ártico en una sola temporada."}],[-168.9,65.8,{"pt":"Estreito de Bering","en":"Bering Strait","es":"Estrecho de Bering"},"poi",{"pt":"2010","en":"2010","es":"2010"},{"pt":"Entre a Passagem Nordeste, pela costa da Rússia, e a Passagem Noroeste, pelo Ártico canadense.","en":"Between the Northeast Passage, along Russia’s coast, and the Northwest Passage, through the Canadian Arctic.","es":"Entre el paso del Nordeste, por la costa de Rusia, y el paso del Noroeste, por el Ártico canadiense."}]]},{"k":"P","p":"Polo Sul geográfico","pol":1,"globo":[-40,-85],"gz":0.9,"gzc":1.8,"ord":1,"kt":{"pt":"Travessia da Antártida","en":"Crossing of Antarctica","es":"Travesía de la Antártida"},"lin":[{"n":{"pt":"1996–1997: primeira travessia solitária e sem apoio da Antártida, cerca de 2.845 km em 64 dias","en":"1996–1997: first solo, unsupported crossing of Antarctica, about 2,845 km in 64 days","es":"1996–1997: primera travesía solitaria y sin apoyo de la Antártida, unos 2.845 km en 64 días"},"lg":{"pt":"1996–1997","en":"1996–1997","es":"1996–1997"},"c":"#ff5a4a","t":"line","p":[[-48.5,-78.4],[-50,-80.5],[-55,-83],[-62,-86],[-80,-88.6],[0,-89.97],[-165,-88],[-166,-86],[-170,-84.5],[-178,-82],[172,-80],[168,-78.6],[166.77,-77.85]]}],"pts":[[-48.5,-78.4,{"pt":"Ilha Berkner","en":"Berkner Island","es":"Isla Berkner"},"poi",{"pt":"Partida, 15 nov. 1996","en":"Start, 15 Nov. 1996","es":"Salida, 15 nov. 1996"},{"pt":"Ilha coberta de gelo no mar de Weddell, presa na plataforma Filchner-Ronne. Daqui Ousland partiu sozinho, puxando um trenó e usando uma vela de esqui.","en":"An ice-covered island in the Weddell Sea, locked in the Filchner-Ronne Ice Shelf. From here Ousland set off alone, hauling a sledge and using a ski sail.","es":"Isla cubierta de hielo en el mar de Weddell, atrapada en la barrera Filchner-Ronne. Desde aquí Ousland partió solo, tirando de un trineo y usando una vela de esquí."}],[166.77,-77.85,{"pt":"Base Scott","en":"Scott Base","es":"Base Scott"},"poi",{"pt":"Chegada, 17 jan. 1997","en":"Finish, 17 Jan. 1997","es":"Llegada, 17 ene. 1997"},{"pt":"Base neozelandesa na ilha de Ross. Ousland chegou aqui depois de 64 dias, completando a primeira travessia da Antártida feita por uma pessoa sozinha e sem apoio.","en":"New Zealand base on Ross Island. Ousland arrived after 64 days, completing the first crossing of Antarctica by one person alone and unsupported.","es":"Base neozelandesa en la isla de Ross. Ousland llegó tras 64 días, completando la primera travesía de la Antártida hecha por una persona sola y sin apoyo."}]]}],"james-clark-ross":{"k":"P","globo":[140,-85],"gz":0.3,"gzc":1.3,"ord":1,"kt":{"pt":"Viagem do Erebus e do Terror","en":"Voyage of Erebus and Terror","es":"Viaje del Erebus y el Terror"},"pts":[[-96.77,70.08,{"pt":"Polo norte magnético","en":"North Magnetic Pole","es":"Polo norte magnético"},"poi",{"pt":"1º jun. 1831, com o tio John Ross","en":"1 June 1831, with his uncle John Ross","es":"1 jun. 1831, con su tío John Ross"},{"pt":"Em 1º de junho de 1831, durante a expedição do tio, John Ross, ele chegou ao polo norte magnético, na península de Boothia, no Ártico canadense.","en":"On 1 June 1831, during the expedition of his uncle John Ross, he reached the North Magnetic Pole on the Boothia Peninsula, in the Canadian Arctic.","es":"El 1 de junio de 1831, durante la expedición de su tío John Ross, llegó al polo norte magnético, en la península de Boothia, en el Ártico canadiense."}],[18.4,-33.9,{"pt":"Cidade do Cabo","en":"Cape Town","es":"Ciudad del Cabo"},"cid",{"pt":"mar. 1840 e abr. 1843","en":"Mar. 1840 and Apr. 1843","es":"mar. 1840 y abr. 1843"},{"pt":"O Erebus e o Terror pararam aqui na ida, em março de 1840, e na volta, em abril de 1843, antes de seguir para a Inglaterra.","en":"Erebus and Terror called here on the way out, in March 1840, and on the way home, in April 1843, before sailing on to England.","es":"El Erebus y el Terror hicieron escala aquí a la ida, en marzo de 1840, y a la vuelta, en abril de 1843, antes de seguir hacia Inglaterra."}],[69.5,-49.3,{"pt":"Ilhas Kerguelen","en":"Kerguelen Islands","es":"Islas Kerguelen"},"poi",{"pt":"maio a jul. 1840","en":"May to July 1840","es":"mayo a jul. 1840"},{"pt":"Os navios ficaram nas ilhas de maio a julho de 1840, fazendo medições do magnetismo e coletando plantas e rochas.","en":"The ships stayed at the islands from May to July 1840, taking magnetic readings and collecting plants and rocks.","es":"Los barcos se quedaron en las islas de mayo a julio de 1840, midiendo el magnetismo y recogiendo plantas y rocas."}],[147.3,-42.9,{"pt":"Hobart, Tasmânia","en":"Hobart, Tasmania","es":"Hobart, Tasmania"},"cid",{"pt":"ago. 1840 e abr. 1841","en":"Aug. 1840 and Apr. 1841","es":"ago. 1840 y abr. 1841"},{"pt":"Base da expedição na Tasmânia, governada na época por John Franklin, amigo de Ross. Ali ele montou um observatório magnético.","en":"The expedition’s base in Tasmania, then governed by Ross’s friend John Franklin. Ross set up a magnetic observatory there.","es":"Base de la expedición en Tasmania, gobernada entonces por John Franklin, amigo de Ross. Allí montó un observatorio magnético."}],[171.2,-71.9,{"pt":"Ilha Possession","en":"Possession Island","es":"Isla Possession"},"poi",{"pt":"12 jan. 1841","en":"12 Jan. 1841","es":"12 ene. 1841"},{"pt":"Em 12 de janeiro de 1841, Ross desembarcou nesta ilha e tomou posse da Terra de Vitória para a Coroa britânica.","en":"On 12 January 1841 Ross landed on this island and claimed Victoria Land for the British Crown.","es":"El 12 de enero de 1841, Ross desembarcó en esta isla y tomó posesión de la Tierra de Victoria para la Corona británica."}],[167.2,-77.5,{"pt":"Montes Erebus e Terror","en":"Mounts Erebus and Terror","es":"Montes Erebus y Terror"},"poi",{"pt":"28 jan. 1841","en":"28 Jan. 1841","es":"28 ene. 1841"},{"pt":"Em 28 de janeiro de 1841, Ross avistou um vulcão em erupção e deu a ele o nome do seu navio. O Erebus é o vulcão ativo mais ao sul do planeta.","en":"On 28 January 1841 Ross sighted an erupting volcano and named it after his ship. Erebus is the southernmost active volcano on Earth.","es":"El 28 de enero de 1841, Ross avistó un volcán en erupción y le dio el nombre de su barco. El Erebus es el volcán activo más austral del planeta."}],[174.1,-35.2,{"pt":"Baía das Ilhas, Nova Zelândia","en":"Bay of Islands, New Zealand","es":"Bahía de las Islas, Nueva Zelanda"},"poi",{"pt":"ago. a nov. 1841","en":"Aug. to Nov. 1841","es":"ago. a nov. 1841"},{"pt":"A expedição passou o inverno de 1841 na Nova Zelândia antes de voltar ao mar de Ross.","en":"The expedition spent the winter of 1841 in New Zealand before returning to the Ross Sea.","es":"La expedición pasó el invierno de 1841 en Nueva Zelanda antes de volver al mar de Ross."}],[198.5,-78.2,{"pt":"Recorde ao sul (78°10′ S)","en":"Farthest south (78°10′ S)","es":"Récord al sur (78°10′ S)"},"poi",{"pt":"23 fev. 1842, diante da barreira de gelo","en":"23 Feb. 1842, off the Ice Barrier","es":"23 feb. 1842, frente a la barrera de hielo"},{"pt":"Em 23 de fevereiro de 1842, diante da grande barreira de gelo, os navios chegaram a 78°10′ S, recorde que durou quase 60 anos.","en":"On 23 February 1842, off the great Ice Barrier, the ships reached 78°10′ S, a record that stood for almost 60 years.","es":"El 23 de febrero de 1842, frente a la gran barrera de hielo, los barcos llegaron a 78°10′ S, récord que duró casi 60 años."}],[-57.8,-51.7,{"pt":"Ilhas Malvinas","en":"Falkland Islands","es":"Islas Malvinas"},"poi",{"pt":"inverno de 1842","en":"winter of 1842","es":"invierno de 1842"},{"pt":"Os navios passaram o inverno de 1842 em Port Louis, nas Malvinas, consertando os estragos da temporada no gelo.","en":"The ships spent the winter of 1842 at Port Louis, in the Falklands, repairing the damage of the season in the ice.","es":"Los barcos pasaron el invierno de 1842 en Port Louis, en las Malvinas, reparando los daños de la temporada en el hielo."}],[-56.8,-64.2,{"pt":"Ilha Cockburn","en":"Cockburn Island","es":"Isla Cockburn"},"poi",{"pt":"jan. 1843","en":"Jan. 1843","es":"ene. 1843"},{"pt":"Em janeiro de 1843, a expedição desembarcou nesta ilhota perto da Península Antártica, onde o naturalista Joseph Hooker coletou liquens e rochas.","en":"In January 1843 the expedition landed on this islet near the Antarctic Peninsula, where the naturalist Joseph Hooker collected lichens and rocks.","es":"En enero de 1843, la expedición desembarcó en este islote cerca de la Península Antártica, donde el naturalista Joseph Hooker recogió líquenes y rocas."}],[-14.9,-71.5,{"pt":"Mar de Weddell","en":"Weddell Sea","es":"Mar de Weddell"},"poi",{"pt":"71°30′ S, mar. 1843","en":"71°30′ S, Mar. 1843","es":"71°30′ S, mar. 1843"},{"pt":"Na última temporada, o gelo compacto barrou os navios a 71°30′ S, em março de 1843. Ross deu meia-volta e rumou para a Cidade do Cabo.","en":"In the last season the pack ice stopped the ships at 71°30′ S, in March 1843. Ross turned back and headed for Cape Town.","es":"En la última temporada, el hielo compacto detuvo los barcos a 71°30′ S, en marzo de 1843. Ross dio media vuelta y puso rumbo a Ciudad del Cabo."}]],"lin":[{"n":{"pt":"1840–1841: da Cidade do Cabo ao mar de Ross e de volta a Hobart","en":"1840–1841: from Cape Town to the Ross Sea and back to Hobart","es":"1840–1841: de Ciudad del Cabo al mar de Ross y de vuelta a Hobart"},"lg":{"pt":"1840–1841","en":"1840–1841","es":"1840–1841"},"c":"#e8d27a","t":"line","p":[[18.4,-33.9],[40,-42],[69.5,-49.3],[100,-47],[130,-45],[147.3,-42.9],[160,-48],[166,-50.7],[169.1,-52.5],[172,-62],[174,-68],[171.2,-71.9],[170,-74],[167.6,-77.2],[175,-77.9],[185,-77.9],[190,-77.6],[185,-72],[175,-66],[160,-55],[147.3,-42.9]]},{"n":{"pt":"1841–1842: segunda temporada no mar de Ross e travessia às Malvinas","en":"1841–1842: second season in the Ross Sea and crossing to the Falklands","es":"1841–1842: segunda temporada en el mar de Ross y travesía a las Malvinas"},"lg":{"pt":"1841–1842","en":"1841–1842","es":"1841–1842"},"c":"#5cc98a","t":"line","p":[[147.3,-42.9],[151.2,-33.9],[162,-34],[174.1,-35.2],[182,-45],[190,-58],[195,-66],[198,-72],[198.5,-78.2],[212,-72],[235,-64],[260,-58],[280,-56],[302.2,-51.7]]},{"n":{"pt":"1842–1843: mar de Weddell e volta pela Cidade do Cabo","en":"1842–1843: Weddell Sea and return via Cape Town","es":"1842–1843: mar de Weddell y regreso por Ciudad del Cabo"},"lg":{"pt":"1842–1843","en":"1842–1843","es":"1842–1843"},"c":"#ff5a4a","t":"dash","p":[[-57.80000000000001,-51.7],[-60,-58],[-56.80000000000001,-64.2],[-48,-62.5],[-35,-64],[-22,-68],[-14.899999999999977,-71.5],[-10,-63],[-2,-52],[10,-40],[18.399999999999977,-33.9]]}],"pol":1},"milford-track":{"k":"T","p":"Milford Track","c":[167.79,-44.8,"Passo Mackinnon"],"pts":[[168.66,-45.03,"Queenstown","cid"],[167.72,-45.41,"Te Anau","cid"],[167.83,-45.18,"Te Anau Downs","cid"],[167.92,-44.67,"Milford Sound","cid"],[167.93,-44.985,"Glade Wharf","poi"],[167.92,-44.93,"Clinton Hut","poi"],[167.73,-44.8,"Quedas Sutherland","poi"],[167.9,-44.675,"Sandfly Point","poi"],[168.297,-44.718,"Routeburn Track","poi"],[167.65,-45.42,"Kepler Track","poi"],[167.16,-45.46,"Doubtful Sound","poi"],[167.79,-44.8,"Passo Mackinnon","poi"]],"bb":[166.6,169.0,-45.8,-44.35],"lin":[{"n":"Milford Track (53,5 km)","c":"#ff5a4a","t":"line","p":[[167.93,-44.985],[167.92,-44.93],[167.86,-44.86],[167.8,-44.82],[167.79,-44.8],[167.75,-44.77],[167.8,-44.72],[167.9,-44.675]]}]},"raja-ampat":{"k":"G","p":"Raja Ampat","c":[130.5,-0.5,"Raja Ampat"],"pts":[[131.25,-0.88,"Sorong","cid"],[130.82,-0.43,"Waisai","cid"],[130.05,0.17,"Wayag","poi"],[130.27,-0.57,"Piaynemo","poi"],[130.52,-0.56,"Arborek","poi"],[130.68,-0.56,"Kri","poi"],[130.0,-1.88,"Misool","poi"],[134.9,-2.6,"Baía de Cenderawasih","poi"]],"bb":[128.9,132.0,-2.3,0.45]}};
const PSLUG=location.pathname.replace(/\/+$/,'').split('/').pop();
// v8: CFG[slug] pode ser uma lista, um item por mapa da página, na ordem em que aparecem (null = deixa o mapa estático)
const C0=CFG[PSLUG],cfgDe=(i)=>Array.isArray(C0)?C0[i]:(i===0?C0:null);
const FIGS=[...document.querySelectorAll('figure.ds-fig-map, figure.dw-fig-map')].map((f,i)=>(f.__mmi=i,f)).filter(f=>f.hasAttribute('data-mm')||cfgDe(f.__mmi));if(!FIGS.length) return;
const p0=location.pathname,hl=(document.documentElement.lang||'').toLowerCase();
const L=/^\/en(\/|$)/.test(p0)?'en':/^\/es(\/|$)/.test(p0)?'es':hl.startsWith('en')?'en':hl.startsWith('es')?'es':'pt';
const PFX=L==='pt'?'':'/'+L;
const TX={
 'Carregando o mapa…':['Loading the map…','Cargando el mapa…'],
 'Mundo':['World','Mundo'],'Ver o mundo inteiro':['See the whole world','Ver el mundo entero'],
 'Aqui':['Here','Aquí'],'Voltar para perto':['Back to the area','Volver a la zona'],
 'Aproximar':['Zoom in','Acercar'],'Afastar':['Zoom out','Alejar'],
 'Anterior':['Previous','Anterior'],'Próximo':['Next','Siguiente'],'de':['of','de'],
 'Fechar':['Close','Cerrar'],'Ler na página':['Read on this page','Leer en esta página'],'Ler o guia completo':['Read the full guide','Leer la guía completa'],
 'Esta página':['This page','Esta página'],
 'Ver no Mapa da aventura':['View on the Adventure Map','Ver en el Mapa de la aventura'],
 'Foto:':['Photo:','Foto:'],'Cidade':['Town','Ciudad'],'Citado nesta página':['Mentioned on this page','Citado en esta página'],
 'Mapa interativo: arraste para mover, use os botões ou Ctrl + roda para aproximar.':['Interactive map: drag to move, use the buttons or Ctrl + scroll to zoom.','Mapa interactivo: arrastre para mover, use los botones o Ctrl + rueda para acercar.'],
 'Use Ctrl + roda do mouse para aproximar o mapa':['Use Ctrl + scroll to zoom the map','Use Ctrl + rueda del ratón para acercar el mapa'],
 'Use ⌘ + roda do mouse para aproximar o mapa':['Use ⌘ + scroll to zoom the map','Use ⌘ + rueda del ratón para acercar el mapa'],
 'Use dois dedos para mover o mapa':['Use two fingers to move the map','Use dos dedos para mover el mapa'],
 'Mergulho':['Diving','Buceo'],'Trekkings':['Treks','Trekkings'],'Grandes cumes':['Great summits','Grandes cumbres'],'Vulcões':['Volcanoes','Volcanes'],
 'Atividades de aventura':['Adventure activities','Actividades de aventura'],'Observação de fauna':['Wildlife watching','Observación de fauna'],
 'Naufrágios':['Shipwrecks','Naufragios'],'Baleias':['Whales','Ballenas'],'Grandes trilhas':['Long-distance trails','Grandes senderos'],
 'Polos':['Poles','Polos'],'Travessias':['Crossings','Travesías'],'Bike':['Bike','Bici'],'Off-road':['Off-road','Off-road'],'Expedições':['Expeditions','Expediciones'],
 'Destaques WAS':['WAS highlights','Destacados WAS'],'Rotas':['Routes','Rutas'],
 'Dificuldade {n} de 5':['Difficulty {n} of 5','Dificultad {n} de 5'],'Melhores meses':['Best months','Mejores meses']
};
const t=s=>L==='pt'||!TX[s]?s:TX[s][L==='en'?0:1];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sem=s=>String(s||'').normalize('NFD').replace(/\p{M}/gu,'').toLowerCase();
// v8: textos da configuração podem vir por idioma {pt,en,es}; longitudes além de 180° voltam ao intervalo
const lo=v=>v&&typeof v==='object'&&!Array.isArray(v)?(v[L]||v.pt||''):(v||'');
const nx=x=>((x+180)%360+360)%360-180;
const slug=s=>sem(s).replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
const MLV='5.24.0',MLB='https://cdn.jsdelivr.net/npm/maplibre-gl@'+MLV+'/dist/maplibre-gl';
const GHB='https://cdn.jsdelivr.net/gh/Alberto-Andrich/was-mapa-dados@387bc7d62ac1901ed1b5a3cda5eba5259d13d9fc/v1/',MINI='https://cdn.jsdelivr.net/gh/Alberto-Andrich/was-mapa-dados@32dc150bd65e96efc2ad6b0a007b9c6173788246/v1/mini/',WF='https://cdn.prod.website-files.com/5c8fb586e1e6032286bcf1ef/';
const URLS={
 base:[MINI+'mini-base.json'],bat:[GHB+'mapa-batimetria.json',WF+'6b075398265e18baec641588_mapa-batimetria-v1.json'],
 relO:[GHB+'mapa-relevo-oeste.png',WF+'6b074cbae389b55c067b5273_mapa-relevo-oeste-v1.png'],
 relL:[GHB+'mapa-relevo-leste.png',WF+'6b074cc21041671607c29050_mapa-relevo-leste-v1.png'],
 rot:[GHB+'mapa-rotas.json'],
 dest:[WF+'6b072ee13de981040a7cc9d7_mapa-destaques-v1.json'],bal:[WF+'6b0735d7184722d706a702af_mapa-baleias-v1.json'],
 cum:[WF+'6b0741a9d44a3f2fe561ec97_mapa-cumes-v1.json'],mt:[WF+'6b07587b5dc7da548cd96105_mapa-mergulho-trekking-v1.json'],
 c2:[WF+'6b075fe81300f2affd046d00_mapa-camadas2-v1.json'],vu:[WF+'6b086a1b4f50d24db57daff2_mapa-vulcoes-v2.json'],
 fa:[WF+'6b0795558772554683a682a5_mapa-fauna-ativ-v1.json'],nf:[WF+'6b0798bd825ed8800e80cd4f_mapa-naufragios-v1.json']
};
// letra da camada -> [arquivo, chave dentro dele]
const CAMF={G:['mt','merg'],T:['mt','trek'],C:['cum',''],B:['bal',''],L:['c2','L'],P:['c2','P'],X:['c2','X'],K:['c2','B2'],O:['c2','O'],V:['c2','E2'],Z:['vu','VU'],W:['fa','FA'],Q:['fa','AT'],H:['nf','NF'],D:['dest','']};
const CAT={D:['Destaques WAS','#b90000'],C:['Grandes cumes','#eef2f6'],G:['Mergulho','#ff7a45'],T:['Trekkings','#ffd23f'],L:['Grandes trilhas','#9be15d'],P:['Polos','#e8f4ff'],X:['Travessias','#c792ea'],K:['Bike','#ff5fa2'],O:['Off-road','#d4a373'],V:['Expedições','#7b8cff'],Z:['Vulcões','#ff6a2b'],W:['Observação de fauna','#ffb38a'],Q:['Atividades de aventura','#3fe0f0'],H:['Naufrágios','#e8c77a'],B:['Baleias','#7fd6d2']};
const LUGPAG={"etna":"mount-etna","aconcagua":"aconcagua","raja-ampat":"raja-ampat","milford-track":"milford-track","gorilas-das-montanhas-em-bwindi":"bwindi-mountain-gorillas","baloes-da-capadocia":"cappadocia-hot-air-balloons","naufragio-do-thistlegorm":"ss-thistlegorm","peninsula-valdes":"valdes-peninsula","churchill":"churchill-manitoba","jalapao":"jalapao-state-park","stromboli":"stromboli","vesuvio":"mount-vesuvius","santorini":"santorini-volcano","teide":"mount-teide","kilauea":"kilauea","bromo":"mount-bromo","ijen":"kawah-ijen","villarrica":"villarrica-volcano","erta-ale":"erta-ale","yasur":"mount-yasur","timanfaya":"timanfaya-national-park","montanha-do-pico":"mount-pico","hekla":"hekla","eyjafjallajokull-e-fimmvor-uhals":"fimmvorduhals-eyjafjallajokull","nyiragongo":"mount-nyiragongo","ol-doinyo-lengai":"ol-doinyo-lengai","piton-de-la-fournaise":"piton-de-la-fournaise","rinjani":"mount-rinjani","krakatoa":"krakatoa","sakurajima":"sakurajima"};
const MESES={pt:['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'],en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],es:['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']}[L];

// ---------- carregamento ----------
const cacheJ={};
function pegaU(us){let p=Promise.reject();us.forEach(u=>{p=p.catch(()=>fetch(u).then(r=>{if(!r.ok) throw 0;return r.json()}))});return p}
const DICD=L==='pt'?Promise.resolve(null):pegaU([GHB+'i18n/dados-'+L+'.json']).catch(()=>null);
const SKIPD=new Set(['foto','fa','fl','fp','w','q','g','perfil','id','c','link','per','esp','pts','pc']);
function trD(x,tt,key){if(SKIPD.has(key))return x;if(Array.isArray(x))return x.map(v=>trD(v,tt,key));if(x&&typeof x==='object'){if(typeof x.n==='string')x.npt=x.n;for(const k in x)if(k!=='npt')x[k]=trD(x[k],tt,k);return x}if(typeof x==='string'){const v=tt[x.trim()];return v||x}return x}
function pega(k){if(cacheJ[k]) return cacheJ[k];const tr=!['base','bat'].includes(k);
  return cacheJ[k]=Promise.all([pegaU(URLS[k]),tr?DICD:null]).then(([d,tt])=>{if(!tt) return d;return trD(d,tt,'')})}
function carregaML(){if(window.maplibregl) return Promise.resolve();if(carregaML.p) return carregaML.p;
  const c=document.createElement('link');c.rel='stylesheet';c.href=MLB+'.css';document.head.appendChild(c);
  return carregaML.p=new Promise((ok,no)=>{const s=document.createElement('script');s.src=MLB+'.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)})}

// ---------- estilo ----------
(function(){const st=document.createElement('style');st.textContent=`
.wmm{position:relative;width:100%;aspect-ratio:3/2;max-height:82vh;min-height:300px;background:#0a1622;overflow:hidden;color:#e9eef3;font-family:inherit;isolation:isolate;border:1px solid #1d2630}
.wmm.estreito{aspect-ratio:4/5;max-height:78vh}
.wmm .wmm-c{position:absolute;inset:0}
.wmm .wmm-poster{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .6s}
.wmm.pronto .wmm-poster{opacity:0;pointer-events:none}
.wmm .wmm-car{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:rgba(10,14,19,.85);padding:10px 16px;font-size:14px;z-index:3}
.wmm.pronto .wmm-car{display:none}
.wmm .maplibregl-ctrl-attrib{font-size:10px;background:rgba(10,14,19,.6)!important;color:#9aa6b2}
.wmm .maplibregl-ctrl-attrib a{color:#9aa6b2}
.wmm .maplibregl-ctrl-attrib-button{filter:invert(1)}
.wmm .maplibregl-cooperative-gesture-screen{background:rgba(5,8,12,.55);color:#fff;font-size:18px;z-index:6}
.wmm-bts{position:absolute;right:12px;top:12px;z-index:4;display:flex;flex-direction:column;gap:8px}
.wmm-bt{all:unset;box-sizing:border-box;cursor:pointer;width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:rgba(17,22,29,.92);border:1px solid #2a3340;color:#fff;transition:background .15s}
.wmm-bt:hover{background:#1d2631}.wmm-bt:focus-visible{outline:2px solid #64aaff;outline-offset:2px}
.wmm-bt svg{width:22px;height:22px;fill:none;stroke:#fff;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.wmm-leg{position:absolute;left:12px;top:12px;z-index:4;display:flex;flex-wrap:wrap;gap:6px;max-width:calc(100% - 90px);pointer-events:none}
.wmm-leg span{color:#e9eef3;font-family:inherit;background:rgba(17,22,29,.9);border:1px solid #2a3340;font-size:13px;line-height:1;padding:7px 10px;display:flex;align-items:center;gap:7px;white-space:nowrap}
.wmm-leg i{display:inline-block;width:11px;height:11px}
.wmm.estreito .wmm-leg{gap:4px;max-width:calc(100% - 76px)}.wmm.estreito .wmm-leg span{font-size:11.5px;padding:5px 7px;gap:5px}.wmm.estreito .wmm-leg .ct{display:none}
.wmm-leg i.lin{height:3px;width:18px}
.wmm-pol{position:absolute;inset:0;width:100%;height:100%;z-index:2;pointer-events:none;overflow:hidden}
.wmm-pol path{fill:none;stroke-linecap:round;stroke-linejoin:round}.wmm-pol path.s{stroke:rgba(5,8,12,.55)}
.wmm-pol .m{pointer-events:auto;cursor:pointer}.wmm-pol text{font:600 12.5px 'Open Sans',Arial,sans-serif;fill:#fff;paint-order:stroke;stroke:rgba(4,7,11,.9);stroke-width:3.2px}
.wmm-key{display:flex;flex-wrap:wrap;gap:8px 20px;padding:12px 2px 4px;font-size:13.5px;line-height:1.35;color:#d5dce3}
.wmm-key span{display:flex;align-items:center;gap:8px;color:#d5dce3!important;font-size:13.5px!important;line-height:1.35!important;font-family:inherit}
.wmm-key i{flex:none;display:inline-block}.wmm-key i.sq{width:11px;height:11px}.wmm-key i.ln{width:24px;height:3px}
@media (max-width:639px){.wmm-key{gap:6px 14px}.wmm-key span{font-size:12.5px!important}}
.wmm-f{position:absolute;z-index:5;right:68px;top:12px;width:min(360px,calc(100% - 92px));max-height:calc(100% - 24px);overflow:auto;overscroll-behavior:contain;background:#11161d;border-top:4px solid #b90000;box-shadow:0 10px 30px rgba(0,0,0,.55);animation:wmm-in .22s ease}
.wmm-f[hidden]{display:none}
.wmm.estreito .wmm-f{left:8px;right:8px;top:auto;bottom:8px;width:auto;max-height:58%}
@keyframes wmm-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.wmm-f img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;background:#1a222c}
.wmm.estreito .wmm-f img,.wmm.estreito .wmm-f .cap{display:none}.wmm.estreito .wmm-f .cp{padding:12px 14px 10px;gap:6px}.wmm.estreito .wmm-f h3{font-size:19px;padding-right:34px}.wmm.estreito .wmm-f p{font-size:14.5px;line-height:1.5}
.wmm-f .cap{font-size:11px;color:#8e9aa6;padding:5px 16px 0;line-height:1.35}
.wmm-f .cap a{color:#8e9aa6}
.wmm-f .cp{padding:12px 16px 14px;display:flex;flex-direction:column;gap:8px}
.wmm-f .kk{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#aeb8c2;display:flex;align-items:center;gap:7px}
.wmm-f .kk i{width:9px;height:9px;display:inline-block}
.wmm-f h3{margin:0;font-size:21px;line-height:1.15;color:#fff;font-weight:700}
.wmm-f .mt{font-size:14px;color:#aeb8c2;margin:-2px 0 0}
.wmm-f p{margin:0;font-size:15px;line-height:1.55;color:#dfe5ea}
.wmm-f .aq{font-size:12px;color:#fff;background:#b90000;align-self:flex-start;padding:3px 8px;letter-spacing:.04em}
.wmm-f .ac{display:flex;justify-content:center;margin-top:4px}
.wmm-f .ac a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 18px;background:#b90000;color:#fff;text-decoration:none;font-size:15px;font-weight:600}
.wmm-f .ac a:hover{background:#d10000}
.wmm-f .nv{position:sticky;bottom:0;display:flex;align-items:center;justify-content:center;gap:12px;padding:10px 12px;background:#0d1117;border-top:1px solid #222a34}
.wmm-f .nv button{all:unset;box-sizing:border-box;cursor:pointer;min-height:44px;padding:0 14px;border:1px solid #39434f;color:#fff;font-size:14px;display:flex;align-items:center;gap:6px}
.wmm-f .nv button:hover{background:#1d2631}.wmm-f .nv button:focus-visible{outline:2px solid #64aaff}
.wmm-f .nv span{font-size:13px;color:#aeb8c2;min-width:56px;text-align:center}
.wmm-f .x{all:unset;cursor:pointer;position:absolute;right:6px;top:6px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:rgba(10,14,19,.75);color:#fff;font-size:22px;z-index:2}
.wmm-f .x:focus-visible{outline:2px solid #64aaff}
.wmm-alvo{width:0;height:0;pointer-events:none}
.wmm-alvo i{position:absolute;left:-26px;top:-26px;width:52px;height:52px;border-radius:50%;border:2px solid #fff;opacity:0;animation:wmm-radar 1.6s ease-out infinite}
.wmm-alvo i+i{animation-delay:.8s}
@keyframes wmm-radar{0%{transform:scale(.3);opacity:.95}100%{transform:scale(1.9);opacity:0}}
.wmm .maplibregl-popup-content{background:#11161d;color:#fff;border:1px solid #2a3340;border-radius:0;padding:7px 11px;font-size:13px;line-height:1.3;box-shadow:0 4px 14px rgba(0,0,0,.5)}
.wmm .maplibregl-popup-tip{display:none}
.wmm .maplibregl-popup-content small{display:block;color:#aeb8c2;font-size:11px}
.ds-fig-map.wmm-on>img,.dw-fig-map.wmm-on>img{display:none}
.dw-fig-map.wmm-on{max-width:1100px!important;margin-left:auto;margin-right:auto}
.dw-fig-map .wmm-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.ds-fig-map .wmm-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@media (prefers-reduced-motion:reduce){.wmm-alvo i{animation:none;opacity:.8;transform:scale(1.2)}.wmm-alvo i+i{display:none}.wmm-f{animation:none}}
`;document.head.appendChild(st)})();

// ---------- ícones (mesmas formas do Mapa da aventura) ----------
const PR=2,E='#14181d';
const DIMS={D:[16,16],B:[15,15],G:[15,15],C:[20,18],T:[18,18],P:[19,19],L:[22,11],X:[19,19],K:[16,16],O:[19,19],V:[16,20],Z:[20,16],W:[19,18],Q:[16,22],H:[22,14]};
const POL={P:'50 0,61 35,98 35,68 57,79 91,50 70,21 91,32 57,2 35,39 35',X:'0 0,100 50,0 100',O:'25 3,75 3,100 50,75 97,25 97,0 50',Z:'30 0,70 0,100 100,0 100',W:'50 0,100 38,82 100,18 100,0 38',Q:'58 0,8 58,44 58,32 100,92 40,56 40,72 0',H:'0 30,100 30,80 100,20 100',T:'50 0,100 50,50 100,0 50'};
function tela(w,h){const c=document.createElement('canvas');c.width=Math.ceil(w*PR);c.height=Math.ceil(h*PR);const x=c.getContext('2d');x.scale(PR,PR);return [c,x]}
function poli(x,k,l,tp,w,h){x.beginPath();POL[k].split(',').forEach((s,i)=>{const [a,b]=s.trim().split(' ').map(Number),X=l+a/100*w,Y=tp+b/100*h;i?x.lineTo(X,Y):x.moveTo(X,Y)});x.closePath()}
function rret(x,l,tp,w,h,r){x.beginPath();if(x.roundRect) x.roundRect(l,tp,w,h,r);else x.rect(l,tp,w,h)}
function caixa(x,k,l,tp,w,h,ex){if(k==='B'){x.beginPath();x.arc(l+w/2,tp+h/2,w/2,0,7)}else if(k==='G') rret(x,l,tp,w,h,3+ex);else{x.beginPath();x.rect(l,tp,w,h)}}
function forma(k,x,o){const [w,h]=DIMS[k],cor=CAT[k][1];
  if(k==='D'){x.fillStyle='#fff';x.fillRect(o,o,w,h);x.fillStyle=cor;x.fillRect(o+2,o+2,w-4,h-4)}
  else if(k==='B'){x.fillStyle='#fff';x.beginPath();x.arc(o+w/2,o+h/2,w/2,0,7);x.fill();x.fillStyle=cor;x.beginPath();x.arc(o+w/2,o+h/2,w/2-2,0,7);x.fill()}
  else if(k==='G'){x.fillStyle='#fff';rret(x,o,o,w,h,3);x.fill();const g=x.createLinearGradient(o+1.5,o+1.5,o+w-1.5,o+h-1.5);
    [[0,cor],[.36,cor],[.36,'#fff'],[.64,'#fff'],[.64,cor],[1,cor]].forEach(([a,c])=>g.addColorStop(a,c));x.fillStyle=g;rret(x,o+1.5,o+1.5,w-3,h-3,1.5);x.fill()}
  else if(k==='C'){x.fillStyle=cor;x.beginPath();x.moveTo(o,o+18);x.lineTo(o+10,o);x.lineTo(o+20,o+18);x.closePath();x.fill();x.fillStyle='#5c6a78';x.beginPath();x.moveTo(o+6,o+14);x.lineTo(o+10,o+7);x.lineTo(o+14,o+14);x.closePath();x.fill()}
  else if(k==='L'){x.fillStyle=E;rret(x,o,o,w,h,6);x.fill();x.fillStyle=cor;rret(x,o+2,o+2,w-4,h-4,4);x.fill()}
  else if(k==='K'){x.fillStyle=E;x.beginPath();x.arc(o+8,o+8,9.5,0,7);x.fill();x.fillStyle=cor;x.beginPath();x.arc(o+8,o+8,8,0,7);x.fill();x.fillStyle=E;x.beginPath();x.arc(o+8,o+8,4,0,7);x.fill()}
  else if(k==='V'){x.fillStyle=E;x.fillRect(o-1,o-1,5,22);x.fillStyle='#fff';x.fillRect(o,o,3,20);x.fillStyle=cor;poli(x,'X',o+3,o+1,13,11);x.fill()}
  else{const n={X:[3,4,3,2],Z:[3,3,2,3],H:[3,3,2,3]}[k]||[3,3,3,3];x.fillStyle=E;poli(x,k,o,o,w,h);x.fill();
    if(k==='Z'){const g=x.createLinearGradient(0,o+n[0],0,o+h-n[2]);[[0,'#ffd23f'],[.26,'#ffd23f'],[.26,cor],[1,cor]].forEach(([a,c])=>g.addColorStop(a,c));x.fillStyle=g}else x.fillStyle=cor;
    poli(x,k,o+n[3],o+n[0],w-n[1]-n[3],h-n[0]-n[2]);x.fill()}}
function icone(k,brilho,esc){const [w0,h0]=DIMS[k],pad=brilho?22:8,W=w0+2*pad,H=h0+2*pad;const [c,x]=tela(W,H),[s,sx]=tela(W,H);forma(k,sx,pad);
  if('DBG'.includes(k)){
    if(brilho){x.save();x.shadowColor='rgba(255,255,255,.55)';x.shadowBlur=14*PR;x.shadowOffsetX=1e4*PR;x.fillStyle='#000';caixa(x,k,pad-4-1e4,pad-4,w0+8,h0+8,4);x.fill();x.restore()}
    const ex=brilho?3:4;x.fillStyle=brilho?'#fff':{D:'rgba(185,0,0,.25)',B:'rgba(127,214,210,.22)',G:'rgba(255,122,69,.25)'}[k];caixa(x,k,pad-ex,pad-ex,w0+2*ex,h0+2*ex,ex);x.fill();x.drawImage(s,0,0,W,H)}
  else{const [m,mx]=tela(W,H);mx.shadowColor='#000';mx.shadowBlur=1.5*PR;mx.drawImage(s,0,0,W,H);
    x.shadowColor=brilho?'rgba(255,255,255,.95)':k==='C'?'rgba(238,242,246,.35)':k==='T'?'rgba(255,210,63,.35)':'rgba(255,255,255,.25)';x.shadowBlur=(brilho?8:4)*PR;x.drawImage(m,0,0,W,H)}
  return x.getImageData(0,0,c.width,c.height)}
function marcaCitado(tipo){const S=tipo==='cid'?14:14,[c,x]=tela(S,S),m=S/2;
  if(tipo==='cid'){x.fillStyle=E;x.beginPath();x.arc(m,m,5.5,0,7);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(m,m,4,0,7);x.fill()}
  else{x.fillStyle=E;x.fillRect(m-5.5,m-5.5,11,11);x.fillStyle='#fff';x.fillRect(m-4,m-4,8,8);x.fillStyle='#b90000';x.fillRect(m-2.2,m-2.2,4.4,4.4)}
  return x.getImageData(0,0,c.width,c.height)}
const ICO={
 mais:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
 menos:'<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
 mundo:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.7 3.9 5.7 3.9 9s-1.3 6.3-3.9 9c-2.6-2.7-3.9-5.7-3.9-9S9.4 5.7 12 3z"/></svg>',
 aqui:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4"/><circle cx="12" cy="12" r="7.2"/></svg>',
 ant:'<svg viewBox="0 0 24 24" width="16" height="16" style="fill:none;stroke:#fff;stroke-width:2"><path d="M15 5l-7 7 7 7"/></svg>',
 prox:'<svg viewBox="0 0 24 24" width="16" height="16" style="fill:none;stroke:#fff;stroke-width:2"><path d="M9 5l7 7-7 7"/></svg>'
};

// ---------- geometria ----------
const mercY=l=>0.5-Math.log(Math.tan(Math.PI/4+Math.max(-85.05,Math.min(85.05,l))*Math.PI/360))/(2*Math.PI);
const yLat=y=>360/Math.PI*Math.atan(Math.exp((0.5-y)*2*Math.PI))-90;
// curva suave (Catmull-Rom centrípeta) para os traçados citados: rotas sempre vetoriais e limpas (regra de 26/11)
function suave(pts,n){if(pts.length<3) return pts;const o=[],P=[pts[0]].concat(pts,[pts[pts.length-1]]);
  for(let i=1;i<P.length-2;i++){const [p0,p1,p2,p3]=[P[i-1],P[i],P[i+1],P[i+2]];
    const d=(a,b)=>Math.pow(Math.hypot(b[0]-a[0],b[1]-a[1]),0.5)||1e-6,t1=d(p0,p1),t2=t1+d(p1,p2),t3=t2+d(p2,p3);
    for(let j=0;j<n;j++){const tt=t1+(t2-t1)*j/n,L=(a,b,ta,tb)=>[(tb-tt)/(tb-ta)*a[0]+(tt-ta)/(tb-ta)*b[0],(tb-tt)/(tb-ta)*a[1]+(tt-ta)/(tb-ta)*b[1]];
      const A1=L(p0,p1,0,t1),A2=L(p1,p2,t1,t2),A3=L(p2,p3,t2,t3),B1=L(A1,A2,0,t2),B2=L(A2,A3,t1,t3);o.push(L(B1,B2,t1,t2))}}
  o.push(pts[pts.length-1]);return o}

// ---------- ficha ----------
function textoFicha(k,d){
  const meta=[d.reg||d.cord,d.pais].filter(Boolean).join(', ')+(d.alt?' · '+Number(d.alt).toLocaleString(L==='en'?'en-US':'pt-BR')+' m':'');
  let tx=d.vida||(d.info&&d.info[0]&&d.info[0][1])||d.fazer||d.txt||d.hist||'';
  if(tx.length>230){const c=tx.slice(0,230);tx=c.slice(0,Math.max(c.lastIndexOf('. ')+1,c.lastIndexOf(' ')))+(c.lastIndexOf('. ')>120?'':'…')}
  const ext=[];if(d.d) ext.push(t('Dificuldade {n} de 5').replace('{n}',d.d));
  if(d.meses&&d.meses.length&&d.meses.length<12) ext.push(t('Melhores meses')+': '+d.meses.slice().sort((a,b)=>a-b).map(m=>MESES[m-1]).join(', '));
  return {meta,tx,ext:ext.join(' · ')}}

function MiniMapa(fig,cfg){
  const S={fig,cfg,pts:[],ordem:[],aberto:-1,alvo:null};
  const img=fig.querySelector('img');
  const box=document.createElement('div');box.className='wmm';box.setAttribute('role','region');
  box.setAttribute('aria-label',t('Mapa interativo: arraste para mover, use os botões ou Ctrl + roda para aproximar.'));
  if(img){const pi=document.createElement('img');pi.className='wmm-poster';pi.src=img.currentSrc||img.src;pi.alt='';pi.setAttribute('aria-hidden','true');box.appendChild(pi)}
  const car=document.createElement('div');car.className='wmm-car';car.textContent=t('Carregando o mapa…');box.appendChild(car);
  const cont=document.createElement('div');cont.className='wmm-c';box.appendChild(cont);
  fig.insertBefore(box,fig.firstChild);
  const estreito=()=>box.classList.toggle('estreito',box.clientWidth<640);estreito();
  // a descrição do mapa estático continua para leitores de tela
  if(img&&img.alt){const sr=document.createElement('span');sr.className='wmm-sr';sr.textContent=img.alt;fig.appendChild(sr)}
  fig.classList.add('wmm-on');
  // botão "Ver no Mapa da aventura" leva direto ao lugar
  const sec=fig.closest('section')||fig.parentNode;
  return {S,fig,box,cont,car,sec};
}

function montar(M){
  const {S,box,cont,car,sec}=M,cfg=S.cfg,k=cfg.k;
  const temSul=(cfg.pts||[]).some(p=>p[1]<-58)||(cfg.c&&cfg.c[1]<-58)||k==='P';
  const LAT_N=84,LAT_S=temSul?-85:-60,FAIXA=mercY(LAT_S)-mercY(LAT_N);
  // v7 (Alberto, 27/11): afastando, o mapa vira globo; aproximando, volta a ser plano. Zoom mínimo = globo inteiro na janela
  const zMin=()=>{const w=cont.clientWidth||600,h=cont.clientHeight||400;return Math.max(0.2,Math.log2(0.9*Math.min(w,h)*Math.PI/512))};
  // v8: mapas polares (cfg.pol) ficam sempre em globo, porque o plano corta tudo além de 85° de latitude
  const proj=z0=>cfg.pol?{type:'vertical-perspective'}:({type:['interpolate',['linear'],['zoom'],z0+0.9,'vertical-perspective',z0+2.3,'mercator']});
  // v8: no globo do MapLibre o número do zoom muda com a latitude do centro (perto do polo o mesmo tamanho tem zoom menor)
  const zAt=lat=>zMin()+(cfg.pol?Math.log2(Math.max(Math.cos(Math.max(-85.05,Math.min(85.05,lat||0))*Math.PI/180),0.06)):0);M.zAt=zAt;
  const toque=matchMedia('(pointer:coarse)').matches&&!matchMedia('(pointer:fine)').matches;
  const mac=/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent);
  const map=new maplibregl.Map({container:cont,
    style:{version:8,projection:proj(zMin()),sky:{'atmosphere-blend':['interpolate',['linear'],['zoom'],0,0.55,5,0.2,7,0]},glyphs:GHB+'fonts/{fontstack}/{range}.pbf',sources:{},layers:[{id:'fundo',type:'background',paint:{'background-color':'#0a1622'}}]},
    center:cfg.c?cfg.c.slice(0,2):[0,15],zoom:zAt(cfg.c?cfg.c[1]:15),minZoom:cfg.pol?zMin()-4.2:zMin(),maxZoom:11,renderWorldCopies:true,
    cooperativeGestures:toque,dragRotate:false,pitchWithRotate:false,touchPitch:false,clickTolerance:6,
    attributionControl:{compact:true,customAttribution:'NASA · Natural Earth · WAS'},
    locale:{'CooperativeGesturesHandler.WindowsHelpText':t('Use Ctrl + roda do mouse para aproximar o mapa'),'CooperativeGesturesHandler.MacHelpText':t('Use ⌘ + roda do mouse para aproximar o mapa'),'CooperativeGesturesHandler.MobileHelpText':t('Use dois dedos para mover o mapa')}
  });
  M.map=map;(window.__wmm=window.__wmm||[]).push(M);
  map.touchZoomRotate.disableRotation();map.scrollZoom.setWheelZoomRate(1/300);
  const ajusta=()=>{estreitoM();if(cfg.pol){const z=zAt(map.getCenter().lat);if(Math.abs(z-map.getMinZoom())>0.02) map.setMinZoom(z);return}const z=zMin();if(Math.abs(z-map.getMinZoom())>0.02){map.setMinZoom(z);try{map.setProjection(proj(z))}catch(e){}}};
  if(cfg.pol) map.on('moveend',ajusta);
  const estreitoM=()=>box.classList.toggle('estreito',box.clientWidth<640);
  if(window.ResizeObserver) new ResizeObserver(()=>{map.resize();ajusta()}).observe(box);
  map.once('idle',()=>box.querySelectorAll('.maplibregl-compact-show').forEach(e=>e.classList.remove('maplibregl-compact-show')));

  // base: satélite NASA com oceano, batimetria e relevo, como no Mapa da aventura
  const pronto=new Promise(r=>map.isStyleLoaded()?r():map.once('style.load',r));
  const precisa=['base','bat',CAMF[k][0]].concat(cfg.rot&&cfg.rot.length?['rot']:[]);
  Promise.all([pronto].concat(precisa.map(pega))).then(([_,base,bat,cam,rot])=>{
    const VZ={type:'FeatureCollection',features:[]};
    map.setPaintProperty('fundo','background-color',cfg.pol?'#d2d8dd':'#b9c0c7');
    const TOM={'raster-brightness-max':0.8,'raster-saturation':0.18,'raster-contrast':0.12,'raster-fade-duration':150,'raster-resampling':'linear'};
    map.addSource('gelo',{type:'geojson',data:{type:'FeatureCollection',features:base.ice.features.concat(base.shelves.features)}});
    map.addLayer({id:'gelo',type:'fill',source:'gelo',paint:{'fill-color':'#28323d'}});
    map.addSource('bmng',{type:'raster',tileSize:256,maxzoom:8,tiles:['https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg']});
    map.addLayer({id:'bmng',type:'raster',source:'bmng',paint:TOM});
    map.addSource('weld',{type:'raster',tileSize:256,minzoom:6,maxzoom:12,bounds:[-180,-60,180,84],tiles:['https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/Landsat_WELD_CorrectedReflectance_TrueColor_Global_Annual/default/default/GoogleMapsCompatible_Level12/{z}/{y}/{x}.jpeg']});
    map.addLayer({id:'weld',type:'raster',source:'weld',minzoom:6.5,paint:Object.assign({},TOM,{'raster-opacity':['interpolate',['linear'],['zoom'],6.5,0,7.5,1]})});
    const OPM=['interpolate',['linear'],['zoom'],7,1,10,0.55];
    map.addSource('oceano',{type:'geojson',data:base.ocean});
    map.addLayer({id:'oceano',type:'fill',source:'oceano',paint:{'fill-color':'#2d6283','fill-opacity':OPM,'fill-antialias':false}});
    map.addSource('bati',{type:'geojson',data:bat,tolerance:0.6});
    map.addLayer({id:'bati',type:'fill',source:'bati',paint:{'fill-antialias':false,'fill-opacity':OPM,'fill-color':['step',['get','d'],'#2d6283',200,'#225373',1000,'#1c4866',2000,'#183f5b',3000,'#143651',4000,'#112f48',5000,'#0e283f',6000,'#0c2237',7000,'#0a1d2f']}});
    try{map.setLight({anchor:'viewport',position:[1.15,210,0],intensity:0.5})}catch(e){}
    const Y=85.0511;
    [['O',-180,0,'relO'],['L',0,180,'relL']].forEach(([s,a,b,u])=>{map.addSource('relevo'+s,{type:'image',url:URLS[u][0],coordinates:[[a,Y],[b,Y],[b,-Y],[a,-Y]]});
      map.addLayer({id:'relevo'+s,type:'raster',source:'relevo'+s,paint:{'raster-opacity':['interpolate',['linear'],['zoom'],4.5,1,7,0],'raster-fade-duration':0,'raster-resampling':'linear'}})});
    const cal=[];(cfg.pol?[[-84.75,.5],[-84.95,1]]:[[-82.8,.25],[-83.8,.5],[-84.5,.8],[-84.95,1]]).forEach(([a,o])=>{for(let l=-180;l<180;l+=30)cal.push({type:'Feature',properties:{o},geometry:{type:'Polygon',coordinates:[[[l,a],[l+30,a],[l+30,-85.06],[l,-85.06],[l,a]]]}})});
    map.addSource('calota',{type:'geojson',data:{type:'FeatureCollection',features:cal}});
    map.addLayer({id:'calota',type:'fill',source:'calota',maxzoom:cfg.pol?24:4,paint:{'fill-color':cfg.pol?'#d2d8dd':'#bcc1c7','fill-opacity':['get','o'],'fill-antialias':false}});
    map.addSource('lagos',{type:'geojson',data:base.lakes});map.addLayer({id:'lagos',type:'fill',source:'lagos',paint:{'fill-color':'#225373'}});
    map.addSource('rios',{type:'geojson',data:base.rivers});map.addLayer({id:'rios',type:'line',source:'rios',paint:{'line-color':'#2a5878','line-width':['interpolate',['linear'],['zoom'],1,0.4,6,1.2]}});
    map.addSource('costa',{type:'geojson',data:base.coast});map.addLayer({id:'costa',type:'line',source:'costa',paint:{'line-color':'#33404e','line-width':['interpolate',['linear'],['zoom'],1,0.5,6,1]}});
    map.addSource('fronteiras',{type:'geojson',data:base.borders});map.addLayer({id:'fronteiras',type:'line',source:'fronteiras',paint:{'line-color':'#3a4553','line-width':0.7,'line-dasharray':[3,2]}});

    // rotas do Mapa da aventura ligadas à página
    const corR={RM:'#5ec8ff',RT:'#ffcf6b',RA:'#ff8fb1',RH:'#e0a96d'},leg=[];
    const linhas=[];
    if(rot&&cfg.rot) rot.rotas.filter(r=>cfg.rot.includes(r.id)).forEach(r=>{linhas.push({type:'Feature',properties:{c:corR[r.c]||'#ffcf6b',n:r.n,d:r.c==='RA'?1:0},geometry:{type:'LineString',coordinates:r.pts}});leg.push([r.n,corR[r.c],1])});
    (cfg.lin||[]).forEach(l=>{const nm=lo(l.n);linhas.push({type:'Feature',properties:{c:l.c||'#ff5a4a',n:nm,d:l.t==='dash'?1:0},geometry:{type:'LineString',coordinates:suave(l.p,8)}});if(nm&&!l.nl) leg.push([lo(l.lg)||nm,l.c||'#ff5a4a',1])});
    // nos mapas polares, o trecho além de 85° S/N sai da camada (o MapLibre o achataria na borda) e vai para a capa SVG
    const corta=f=>{if(!cfg.pol) return f;const out=[];let cur=[];f.geometry.coordinates.forEach(p=>{if(Math.abs(p[1])>84.95){if(cur.length>1) out.push(cur);cur=[]}else cur.push(p)});if(cur.length>1) out.push(cur);return {type:'Feature',properties:f.properties,geometry:{type:'MultiLineString',coordinates:out}}};
    if(linhas.length){map.addSource('lin',{type:'geojson',data:{type:'FeatureCollection',features:linhas.map(corta)}});
      map.addLayer({id:'lin-s',type:'line',source:'lin',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#05080c','line-opacity':.55,'line-width':['interpolate',['linear'],['zoom'],1,3.6,5,4.6,9,6.5]}});
      map.addLayer({id:'lin',type:'line',source:'lin',filter:['==',['get','d'],0],layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':['get','c'],'line-width':['interpolate',['linear'],['zoom'],1,2,5,2.6,9,3.8]}});
      map.addLayer({id:'lin-d',type:'line',source:'lin',filter:['==',['get','d'],1],layout:{'line-cap':'butt','line-join':'round'},paint:{'line-color':['get','c'],'line-dasharray':[2.2,1.6],'line-width':['interpolate',['linear'],['zoom'],1,2,5,2.6,9,3.5]}});
      map.addLayer({id:'lin-n',type:'symbol',source:'lin',minzoom:cfg.globo?3.2:5,layout:{'symbol-placement':'line','text-field':['get','n'],'text-font':['Open Sans Semibold'],'text-size':12,'symbol-spacing':320,'text-max-angle':30},paint:{'text-color':['get','c'],'text-halo-color':'rgba(4,7,11,.9)','text-halo-width':1.6}})}

    // pontos da camada do assunto
    const bloco=CAMF[k][1]?cam[CAMF[k][1]]:cam,lista=(bloco&&bloco.pontos)||(Array.isArray(bloco)?bloco:[]);
    const gs=cfg.g&&cfg.g.length?new Set(cfg.g):null;
    const alvoN=cfg.p?slug(cfg.p):null;
    lista.forEach(d=>{if(d.x==null||d.y==null) return;const eu=alvoN&&(slug(d.npt||d.n)===alvoN||slug(d.n)===alvoN);
      if(gs&&!eu&&!(d.g||[]).some(g=>gs.has(g))) return;S.pts.push({d,xy:[d.x,d.y],eu})});
    if(!S.pts.some(p=>p.eu)&&cfg.c){S.pts.push({d:{n:cfg.c[2]||'',x:cfg.c[0],y:cfg.c[1]},xy:cfg.c.slice(0,2),eu:true,sem:true})}
    S.pts.forEach((p,i)=>p.i=i);
    S.ordem=S.pts.slice().sort((a,b)=>a.xy[0]-b.xy[0]||b.xy[1]-a.xy[1]).map(p=>p.i);
    S.alvo=S.pts.find(p=>p.eu)||null;
    map.addImage('mk',icone(k,false),{pixelRatio:PR});map.addImage('mk-g',icone(k,true),{pixelRatio:PR});
    map.addImage('ct-cid',marcaCitado('cid'),{pixelRatio:PR});map.addImage('ct-poi',marcaCitado('poi'),{pixelRatio:PR});
    const fcP={type:'FeatureCollection',features:S.pts.map(p=>({type:'Feature',id:p.i,properties:{n:p.d.n,eu:p.eu?1:0,o:p.eu?1e4:p.i},geometry:{type:'Point',coordinates:p.xy}}))};
    map.addSource('mk',{type:'geojson',data:fcP});
    map.addLayer({id:'mk',type:'symbol',source:'mk',layout:{'icon-image':['case',['==',['get','eu'],1],'mk-g','mk'],'icon-allow-overlap':true,'icon-ignore-placement':true,'symbol-sort-key':['get','o']}});
    map.addLayer({id:'mk-sel',type:'symbol',source:'mk',filter:['==',['id'],-1],layout:{'icon-image':'mk-g','icon-allow-overlap':true,'icon-ignore-placement':true}});
    map.addLayer({id:'mk-n',type:'symbol',source:'mk',minzoom:cfg.globo?0:3.4,layout:{'text-field':['get','n'],'text-font':['Open Sans Semibold'],'text-size':12.5,'text-anchor':'left','text-offset':[1.1,0],'text-optional':true,'symbol-sort-key':['-',0,['get','o']]},paint:{'text-color':'#fff','text-halo-color':'rgba(4,7,11,.9)','text-halo-width':1.6}});
    // nome do lugar da página sempre visível
    map.addLayer({id:'mk-eu',type:'symbol',source:'mk',filter:['==',['get','eu'],1],layout:{'text-field':['get','n'],'text-font':['Open Sans Semibold'],'text-size':14,'text-anchor':'left','text-offset':[1.2,0],'text-allow-overlap':true},paint:{'text-color':'#fff','text-halo-color':'rgba(4,7,11,.95)','text-halo-width':2}});

    // tudo o que a página cita
    S.cit=(cfg.pts||[]).map((q,i)=>({i,xy:[nx(q[0]),q[1]],n:lo(q[2]),t:q[3]||'poi',d:lo(q[4]),x:lo(q[5])}));
    S.ordC=cfg.ord?S.cit.map(p=>p.i):S.cit.slice().sort((a,b)=>a.xy[0]-b.xy[0]||b.xy[1]-a.xy[1]).map(p=>p.i);
    const cit=S.cit.map(q=>({type:'Feature',id:q.i,properties:{n:q.n,t:q.t},geometry:{type:'Point',coordinates:q.xy}}));
    if(cit.length){map.addSource('ct',{type:'geojson',data:{type:'FeatureCollection',features:cit}});
      map.addLayer({id:'ct',type:'symbol',source:'ct',minzoom:cfg.globo?0:3,layout:{'icon-image':['concat','ct-',['get','t']],'icon-allow-overlap':true,'icon-ignore-placement':true}});
      map.addLayer({id:'ct-sel',type:'circle',source:'ct',filter:['==',['id'],-1],paint:{'circle-radius':11,'circle-color':'rgba(255,255,255,.18)','circle-stroke-color':'#fff','circle-stroke-width':2}},'ct');
      map.addLayer({id:'ct-n',type:'symbol',source:'ct',minzoom:cfg.globo?0:4.5,layout:{'text-field':['get','n'],'text-font':['Open Sans Semibold'],'text-size':12,'text-anchor':'left','text-offset':[0.9,0],'text-optional':true},paint:{'text-color':'#e9eef3','text-halo-color':'rgba(4,7,11,.9)','text-halo-width':1.5}})}

    // legenda discreta
    const lg=document.createElement('div');lg.className='wmm-leg';lg.setAttribute('aria-hidden','true');
    lg.innerHTML='<span><i style="background:'+CAT[k][1]+'"></i>'+esc(t(CAT[k][0]))+'</span>'+(cit.length?'<span class="ct"><i style="background:#fff;outline:2px solid #14181d"></i>'+esc(lo(cfg.kt)||t('Citado nesta página'))+'</span>':'')+
      '';
    box.appendChild(lg);
    // v8 (Alberto, 27/11): legenda completa embaixo do mapa: camada, lugares citados, cada rota com o nome inteiro e itens extras (cfg.kx)
    const kk=document.createElement('div');kk.className='wmm-key';
    let kh='<span><i class="sq" style="background:'+CAT[k][1]+'"></i>'+esc(t(CAT[k][0]))+(cfg.kl?' ('+esc(lo(cfg.kl))+')':'')+'</span>';
    if(cit.length) kh+='<span><i class="sq" style="background:#fff;outline:2px solid #14181d"></i>'+esc(lo(cfg.kt)||t('Citado nesta página'))+'</span>';
    (cfg.lin||[]).forEach(l=>{const nm=lo(l.n);if(!nm) return;const c=l.c||'#ff5a4a';kh+='<span><i class="ln" style="'+(l.t==='dash'?'background:repeating-linear-gradient(90deg,'+c+' 0 6px,transparent 6px 10px)':'background:'+c)+'"></i>'+esc(nm)+'</span>'});
    if(rot&&cfg.rot) rot.rotas.filter(r=>cfg.rot.includes(r.id)).forEach(r=>{kh+='<span><i class="ln" style="background:'+(corR[r.c]||'#ffcf6b')+'"></i>'+esc(r.n)+'</span>'});
    (cfg.kx||[]).forEach(x=>{kh+='<span><i class="'+(x[0]==='ln'?'ln':'sq')+'" style="background:'+x[1]+'"></i>'+esc(lo(x[2]))+'</span>'});
    kk.innerHTML=kh;const fc=M.fig.querySelector('figcaption');M.fig.insertBefore(kk,fc&&fc.parentNode===M.fig?fc:null);

    M.linhas=linhas;if(cfg.pol) capaPolar(M);
    botoes(M);eventos(M);
    box.classList.add('pronto');
    // abre no mundo inteiro, com o radar no lugar, e aproxima até a vista local
    const loc=vistaLocal(M);M.local=loc;
    if(S.alvo||cfg.c||!cfg.globo) radar(M,S.alvo?S.alvo.xy:(cfg.c||loc.center));
    const reduz=matchMedia('(prefers-reduced-motion:reduce)').matches;
    const centro=S.alvo?S.alvo.xy:cfg.c?cfg.c.slice(0,2):null;
    if(centro) map.jumpTo({center:centro,zoom:zAt(centro[1])});
    setTimeout(()=>{if(M.mexeu) return;reduz?map.jumpTo(loc):map.flyTo(Object.assign({},loc,{duration:3200,essential:true,curve:1.3}))},reduz?0:1300);
  }).catch(e=>{car.textContent='';box.classList.add('pronto');M.fig.classList.remove('wmm-on');box.remove()});
}

// v8: o globo do MapLibre não desenha nada além de 85° de latitude. Nos mapas polares, o trecho final das rotas e os pontos
// perto do polo (Polo Sul, 88°23′ S etc.) são desenhados numa camada SVG por cima, reprojetada a cada quadro.
function capaPolar(M){const {map,S,box}=M,NS='http://www.w3.org/2000/svg',LIM=84.7,fora=y=>Math.abs(y)>=LIM;
  const sv=document.createElementNS(NS,'svg');sv.setAttribute('class','wmm-pol');box.insertBefore(sv,box.querySelector('.wmm-leg'));
  const occ=ll=>{try{return map.transform.isLocationOccluded&&map.transform.isLocationOccluded(new maplibregl.LngLat(ll[0],ll[1]))}catch(e){return false}};
  const segs=[];(M.linhas||[]).forEach(f=>{const c=f.geometry.coordinates;let cur=null;
    c.forEach((p,i)=>{const dentro=fora(p[1])||(c[i+1]&&fora(c[i+1][1]))||(c[i-1]&&fora(c[i-1][1]));if(dentro){if(!cur){cur={p:[],c:f.properties.c,d:f.properties.d};segs.push(cur)}cur.p.push(p)}else cur=null})});
  const pts=[];S.pts.forEach(p=>{if(fora(p.xy[1])) pts.push({xy:p.xy,n:p.d.n,cor:CAT[S.cfg.k][1],f:()=>abre(M,p.i,false)})});
  (S.cit||[]).forEach(c=>{if(fora(c.xy[1])) pts.push({xy:c.xy,n:c.n,cor:'#fff',f:()=>abreC(M,c.i,false)})});
  if(!segs.length&&!pts.length){sv.remove();return}
  const g1=document.createElementNS(NS,'g'),g2=document.createElementNS(NS,'g');sv.appendChild(g1);sv.appendChild(g2);
  const linhas=segs.map(sg=>{const a=document.createElementNS(NS,'path'),b=document.createElementNS(NS,'path');a.setAttribute('class','s');b.setAttribute('stroke',sg.c);if(sg.d) b.setAttribute('stroke-dasharray','7 5');g1.appendChild(a);g1.appendChild(b);return [sg,a,b]});
  const marcas=pts.map(q=>{const g=document.createElementNS(NS,'g');g.setAttribute('class','m');g.innerHTML='<rect x="-6" y="-6" width="12" height="12" fill="'+q.cor+'" stroke="#14181d" stroke-width="2"/><text x="11" y="4.5"></text>';
    g.querySelector('text').textContent=q.n;g.addEventListener('click',e=>{e.stopPropagation();M.clicou=0;q.f()});g2.appendChild(g);return [q,g]});
  const desenha=()=>{const z=map.getZoom()-M.zAt(map.getCenter().lat),w=z<1?2.2:z<3?2.8:3.6;
    linhas.forEach(([sg,a,b])=>{let d='';sg.p.forEach((p,i)=>{if(occ(p)){return}const q=map.project(p);d+=(d&&!occ(sg.p[i-1]||p)?'L':'M')+q.x.toFixed(1)+' '+q.y.toFixed(1)});a.setAttribute('d',d);b.setAttribute('d',d);a.setAttribute('stroke-width',w+2.4);b.setAttribute('stroke-width',w)});
    marcas.forEach(([q,g])=>{if(occ(q.xy)){g.style.display='none';return}g.style.display='';const p=map.project(q.xy);g.setAttribute('transform','translate('+p.x.toFixed(1)+' '+p.y.toFixed(1)+')')})};
  map.on('render',desenha);desenha()}

function vistaLocal(M){const S=M.S,cfg=S.cfg,map=M.map;let bb=cfg.bb;
  // v8: páginas polares e viagens oceânicas abrem em globo virado para o lugar (cfg.globo=[lng,lat], cfg.gz = quanto aproxima)
  if(cfg.globo) return {center:[nx(cfg.globo[0]),cfg.globo[1]],zoom:M.zAt(cfg.globo[1])+(cfg.gz==null?0.5:cfg.gz)};
  if(!bb){const xs=[],ys=[];(cfg.pts||[]).forEach(p=>{xs.push(p[0]);ys.push(p[1])});(cfg.lin||[]).forEach(l=>l.p.forEach(p=>{xs.push(p[0]);ys.push(p[1])}));
    const a=S.alvo?S.alvo.xy:cfg.c;if(a){xs.push(a[0]);ys.push(a[1])}
    if(!xs.length) return {center:a||[0,15],zoom:5};
    bb=[Math.min(...xs),Math.max(...xs),Math.min(...ys),Math.max(...ys)]}
  const w=M.cont.clientWidth||600,h=M.cont.clientHeight||400,pad=Math.min(70,w*.1);
  const dx=Math.max(bb[1]-bb[0],0.3),dy=Math.max(mercY(bb[2])-mercY(bb[3]),0.3/360);
  const z=Math.min(10,Math.log2(Math.min((w-2*pad)/(512*dx/360),(h-2*pad)/(512*dy))));
  return {center:[(bb[0]+bb[1])/2,yLat((mercY(bb[2])+mercY(bb[3]))/2)],zoom:Math.max(map.getMinZoom()+1,z)}}

function radar(M,xy){if(!xy) return;const el=document.createElement('div');el.className='wmm-alvo';el.innerHTML='<i></i><i></i>';
  if(M.radar) M.radar.remove();M.radar=new maplibregl.Marker({element:el}).setLngLat(xy).addTo(M.map);
  clearTimeout(M.radarT);M.radarT=setTimeout(()=>{if(M.radar){M.radar.remove();M.radar=null}},5200)}

function botoes(M){const {box,map}=M;const b=document.createElement('div');b.className='wmm-bts';
  const mk=(ic,rot,fn)=>{const x=document.createElement('button');x.type='button';x.className='wmm-bt';x.innerHTML=ICO[ic];x.title=rot;x.setAttribute('aria-label',rot);x.onclick=e=>{e.stopPropagation();M.mexeu=1;fn()};b.appendChild(x)};
  mk('mais',t('Aproximar'),()=>map.zoomIn());mk('menos',t('Afastar'),()=>map.zoomOut());
  mk('mundo',t('Ver o mundo inteiro'),()=>map.flyTo({center:map.getCenter(),zoom:map.getMinZoom(),duration:1400}));
  mk('aqui',t('Voltar para perto'),()=>{map.flyTo(Object.assign({},M.local,{duration:1600}));const a=M.S.alvo;if(a) radar(M,a.xy)});
  box.appendChild(b)}

function eventos(M){const {map,S,box}=M;const cv=map.getCanvas();let dica=null;
  ['dragstart','zoomstart'].forEach(ev=>map.on(ev,e=>{if(e.originalEvent) M.mexeu=1}));
  const topo=fs=>fs.reduce((a,f)=>!a||f.properties.o>a.properties.o?f:a,null);
  map.on('click','mk',e=>{const f=topo(e.features);if(f){e.preventDefault&&e.preventDefault();M.clicou=1;abre(M,f.id,false)}});
  map.on('click','ct',e=>{const f=e.features[0];if(!f||map.queryRenderedFeatures(e.point,{layers:['mk']}).length) return;M.clicou=1;if(dica){dica.remove();dica=null}abreC(M,f.id,false)});
  let hovC=null;map.on('mousemove','ct',e=>{const f=e.features[0];if(!f||f.id===hovC||map.queryRenderedFeatures(e.point,{layers:['mk']}).length) return;hovC=f.id;if(dica) dica.remove();
    dica=new maplibregl.Popup({closeButton:false,closeOnClick:false,offset:10}).setLngLat(f.geometry.coordinates).setHTML(esc(f.properties.n)).addTo(map)});
  map.on('mouseleave','ct',()=>{hovC=null;if(dica){dica.remove();dica=null}});
  // v8: nome da rota ao passar o mouse sobre o traçado
  ['lin','lin-d'].forEach(l=>{if(!map.getLayer(l)) return;map.on('mousemove',l,e=>{const f=e.features[0];if(!f||map.queryRenderedFeatures(e.point,{layers:['mk','ct'].filter(x=>map.getLayer(x))}).length) return;if(dica) dica.remove();
    dica=new maplibregl.Popup({closeButton:false,closeOnClick:false,offset:8}).setLngLat(e.lngLat).setHTML(esc(f.properties.n)).addTo(map)});
    map.on('mouseleave',l,()=>{if(dica){dica.remove();dica=null}})});
  map.on('click',e=>{if(M.clicou){M.clicou=0;return}if(dica){dica.remove();dica=null}fecha(M)});
  ['mk','ct'].forEach(l=>{map.on('mouseenter',l,()=>cv.style.cursor='pointer');map.on('mouseleave',l,()=>cv.style.cursor='')});
  let hov=null;map.on('mousemove','mk',e=>{const f=topo(e.features);if(!f||f.id===hov) return;hov=f.id;if(dica) dica.remove();
    dica=new maplibregl.Popup({closeButton:false,closeOnClick:false,offset:14}).setLngLat(S.pts[f.id].xy).setHTML(esc(S.pts[f.id].d.n)).addTo(map)});
  map.on('mouseleave','mk',()=>{hov=null;if(dica){dica.remove();dica=null}});
  box.addEventListener('keydown',e=>{if(e.key==='Escape') fecha(M)})}

function fecha(M){if(!M.f||M.f.hidden) return;M.f.hidden=true;M.S.aberto=-1;M.map.setFilter('mk-sel',['==',['id'],-1]);if(M.map.getLayer('ct-sel')) M.map.setFilter('ct-sel',['==',['id'],-1])}
function caixaF(M){if(!M.f){M.f=document.createElement('div');M.f.className='wmm-f';M.f.setAttribute('role','dialog');M.box.appendChild(M.f);M.f.addEventListener('click',e=>e.stopPropagation())}return M.f}
function voaPara(M,xy){const {map,box}=M,w=M.cont.clientWidth,est=box.classList.contains('estreito'),fh=M.f.offsetHeight,fw=M.f.offsetWidth;
  const pad=est?{top:20,bottom:Math.min(fh+16,M.cont.clientHeight*.6),left:20,right:20}:{top:20,bottom:20,left:20,right:fw+80};
  return pad}
// o que a própria página diz do lugar citado: o cartão com o mesmo nome (texto e foto) ou a frase que o menciona (27/11)
function doPagina(M,nome){const n=sem(nome).trim();if(!n) return {};const re=new RegExp('(^|[^a-z0-9])'+n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'($|[^a-z0-9])');
  const fora=el=>el.closest('.wmm');
  for(const h of document.querySelectorAll('h3,h4')){if(fora(h)) continue;const ht=sem(h.textContent).trim();if(!ht||!(re.test(ht)||(ht.length>3&&n.includes(ht)))) continue;
    const card=h.closest('.ds-card,.dw-card,.ds-near,.ds-item')||h.parentElement;const p=card&&[...card.querySelectorAll('p')].find(x=>x.textContent.trim().length>30);
    const im=card&&card.querySelector('img');const meta=card&&card.querySelector('.ds-meta');
    if(p) return {tx:p.textContent.trim(),img:im?(im.currentSrc||im.src):'',meta:meta?meta.textContent.trim():'',alvo:card}}
  for(const p of document.querySelectorAll('section p, section figcaption, section li')){if(fora(p)) continue;const tx=p.textContent;if(!re.test(sem(tx))) continue;
    const fr=tx.split(/(?<=[.!?])\s+/).find(x=>re.test(sem(x)));if(fr&&fr.length>20) return {tx:fr.trim(),alvo:p}}
  return {}}
function abreC(M,j,voa){const {S,map}=M,c=S.cit[j];if(!c) return;S.aberto=-1;const f=caixaF(M);
  const info=doPagina(M,c.n),tx=c.x||info.tx||'',pos=S.ordC.indexOf(j),mt=c.d||info.meta||'';let txc=tx;
  if(txc.length>280){const a=txc.slice(0,280);txc=a.slice(0,Math.max(a.lastIndexOf('. ')+1,a.lastIndexOf(' ')))+(a.lastIndexOf('. ')>150?'':'…')}
  let h='<button type="button" class="x" aria-label="'+esc(t('Fechar'))+'">×</button>';
  if(info.img) h+='<img src="'+esc(info.img)+'" alt="" loading="lazy">';
  h+='<div class="cp"><div class="kk"><i style="background:#fff;outline:2px solid #14181d"></i>'+esc(c.t==='cid'?t('Cidade'):(lo(S.cfg.kt)||t('Citado nesta página')))+'</div>'+
    '<h3>'+esc(c.n)+'</h3>'+(mt?'<div class="mt">'+esc(mt)+'</div>':'')+(txc?'<p>'+esc(txc)+'</p>':'')+
    (info.alvo?'<div class="ac"><a href="#" class="ir">'+esc(t('Ler na página'))+'</a></div>':'')+'</div>';
  if(S.ordC.length>1) h+='<div class="nv"><button type="button" data-v="-1">'+ICO.ant+esc(t('Anterior'))+'</button><span>'+(pos+1)+' '+esc(t('de'))+' '+S.ordC.length+'</span><button type="button" data-v="1">'+esc(t('Próximo'))+ICO.prox+'</button></div>';
  f.innerHTML=h;f.hidden=false;f.scrollTop=0;
  f.querySelector('.x').onclick=()=>fecha(M);
  const ir=f.querySelector('.ir');if(ir) ir.onclick=e=>{e.preventDefault();info.alvo.scrollIntoView({behavior:'smooth',block:'center'});info.alvo.animate&&info.alvo.animate([{outline:'2px solid #b90000',outlineOffset:'6px'},{outline:'2px solid rgba(185,0,0,0)',outlineOffset:'6px'}],{duration:2600})};
  f.querySelectorAll('.nv button').forEach(b=>b.onclick=()=>{const n=S.ordC.length,k=S.ordC[(pos+Number(b.dataset.v)+n)%n];M.mexeu=1;abreC(M,k,true);const nb=M.f.querySelector('.nv button[data-v="'+b.dataset.v+'"]');if(nb) nb.focus()});
  map.setFilter('mk-sel',['==',['id'],-1]);map.setFilter('ct-sel',['==',['id'],j]);
  if(voa){map.flyTo({center:c.xy,zoom:S.cfg.globo?M.zAt(c.xy[1])+Math.max(S.cfg.gzc==null?1.1:S.cfg.gzc,map.getZoom()-M.zAt(map.getCenter().lat)):Math.max(map.getZoom(),Math.min(9,(M.local&&M.local.zoom)||7)),padding:voaPara(M,c.xy),duration:1300,essential:true});radar(M,c.xy)}}

function abre(M,i,voa){const {S,map,box}=M,p=S.pts[i];if(!p) return;S.aberto=i;
  caixaF(M);if(map.getLayer('ct-sel')) map.setFilter('ct-sel',['==',['id'],-1]);
  const d=p.d,k=S.cfg.k,{meta,tx,ext}=textoFicha(k,d),pos=S.ordem.indexOf(i);
  const pg=LUGPAG[slug(d.npt||d.n)];const aqui=p.eu;
  let h='<button type="button" class="x" aria-label="'+esc(t('Fechar'))+'">×</button>';
  if(d.foto) h+='<img src="'+esc(d.foto)+'" alt="" loading="lazy">'+(d.fa?'<div class="cap">'+esc(t('Foto:'))+' '+esc(d.fa)+(d.fl?', '+esc(d.fl):'')+(d.fp?' · <a href="'+esc(d.fp)+'" target="_blank" rel="noopener">Commons</a>':'')+'</div>':'');
  h+='<div class="cp"><div class="kk"><i style="background:'+CAT[k][1]+'"></i>'+esc(t(CAT[k][0]))+'</div>'+(aqui?'<span class="aq">'+esc(t('Esta página'))+'</span>':'')+
    '<h3>'+esc(d.n)+'</h3>'+(meta?'<div class="mt">'+esc(meta)+'</div>':'')+(tx?'<p>'+esc(tx)+'</p>':'')+(ext?'<div class="mt">'+esc(ext)+'</div>':'')+
    (pg&&!aqui?'<div class="ac"><a href="'+PFX+'/destinations/'+esc(pg)+'">'+esc(t('Ler o guia completo'))+'</a></div>':'')+'</div>';
  if(S.ordem.length>1) h+='<div class="nv"><button type="button" data-v="-1">'+ICO.ant+esc(t('Anterior'))+'</button><span>'+(pos+1)+' '+esc(t('de'))+' '+S.ordem.length+'</span><button type="button" data-v="1">'+esc(t('Próximo'))+ICO.prox+'</button></div>';
  M.f.innerHTML=h;M.f.hidden=false;M.f.scrollTop=0;
  M.f.querySelector('.x').onclick=()=>fecha(M);
  M.f.querySelectorAll('.nv button').forEach(b=>b.onclick=()=>{const n=S.ordem.length,j=S.ordem[(pos+Number(b.dataset.v)+n)%n];M.mexeu=1;abre(M,j,true);const nb=M.f.querySelector('.nv button[data-v="'+b.dataset.v+'"]');if(nb) nb.focus()});
  map.setFilter('mk-sel',['==',['id'],i]);
  if(voa){const w=M.cont.clientWidth,est=box.classList.contains('estreito'),fh=M.f.offsetHeight,fw=M.f.offsetWidth;
    const pad=est?{top:20,bottom:Math.min(fh+16,M.cont.clientHeight*.6),left:20,right:20}:{top:20,bottom:20,left:20,right:fw+80};
    const z=S.cfg.pol?M.zAt(p.xy[1])+Math.max(S.cfg.gzc==null?1.1:S.cfg.gzc,map.getZoom()-M.zAt(map.getCenter().lat)):Math.max(Math.min(5,Math.max(2,Math.log2(w/512*360/70))),map.getMinZoom()+0.3);
    map.flyTo({center:p.xy,zoom:z,padding:pad,duration:1500,essential:true});radar(M,p.xy)}}

// ---------- início: só carrega quando a seção chega perto da tela ----------
function inicia(fig){let cfg;try{cfg=fig.hasAttribute('data-mm')?JSON.parse(fig.getAttribute('data-mm')):cfgDe(fig.__mmi)}catch(e){return}if(!cfg||!cfg.k||!CAMF[cfg.k]) return;
  const M=MiniMapa(fig,cfg);
  // o botão "Ver no Mapa da aventura" da seção abre o mapa geral já no lugar
  const a=M.sec&&M.sec.querySelector('a[href*="mapa-da-aventura"]');if(a){const nm=cfg.p||(cfg.c&&cfg.c[2]);if(nm&&!/lugar=/.test(a.href)) a.href=a.getAttribute('href')+(a.getAttribute('href').includes('?')?'&':'?')+'lugar='+slug(nm)}
  carregaML().then(()=>{ if(!window.maplibregl||!maplibregl.Map) throw 0; montar(M)}).catch(()=>{M.box.remove();fig.classList.remove('wmm-on')})}
const io=('IntersectionObserver' in window)?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);inicia(e.target)}}),{rootMargin:'400px 0px'}):null;
FIGS.forEach(f=>io?io.observe(f):inicia(f));
// pré-carrega os dados leves quando a página fica ociosa
})();
