Estou planejando fazer uma aplicação para Brasileiros que gostariam de comprar produtos do Japão. 
Essa aplicação deve levar em consideração as taxas que são cobradas para produtos estrangeiros, especialmente produtos japoneses.
O usuário vai colocar a categoria + o nome do produto + o preço em ienes e a aplicação vai converter o preço do produto para reais e separadamente vai estar constando o preço das taxas sobre o produto e o frete do Japão - Brasil.


## Economia de token:
 - Dados recentes (Dados extraídos em data XX/XX/XXXX) salvos pra que essa requisição não precise ser feita a cada cálculo, meio que como um sistema de cache. Sei que cada caso é um caso mas no caso de alguma faixa de preço ou categoria de produtos ter uma taxa similar ou exatamente igual, salvar essa info pra ser usada nos cálculos seguintes. É importante distinguir se esse valor muda com frequência ou não, pra saber com que frequência esse valor precisa ser requisitado novamente. 


## O problema de quem esse web app resolve:
Pessoas que gostariam de consumir produtos japoneses e que querem saber o preço total do produto juntos com as taxas tributárias + frete.


## Fluxo ideal de usuário:
1. O usuário colocará a categoria do produto + nome do produto + quantidade + preço em ienes
2. o usuário pode colocar quantos produtos quiser
?. É razoável que o cliente escolha se as encomendas virão na mesma caixa? colocar se isso vai afetar no preço ou não, dar sempre os valores de (mesmo carregamento) vs. (carregamentos separados?individuais)
...



---

