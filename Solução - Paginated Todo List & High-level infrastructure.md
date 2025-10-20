**Paginated Todo List**

Tempo empenhado para estudo: +/- 10 horas

Tempo empenhado para resolução: +/- 7 horas



O tempo dedicado ao projeto foi considerável, principalmente por eu não possuir conhecimento prévio nas linguagens utilizadas. Para superar essa limitação, busquei aprender por conta própria, recorrendo a vídeos no YouTube, sites especializados e fóruns de discussão sobre programação. Durante esse período, desenvolvi uma aplicação do zero, utilizando alguns dos modelos disponibilizados no desafio, o que me ajudou a compreender melhor a lógica e a estrutura propostas. Essa aplicação também está disponível no meu GitHub.



Esse desafio representou uma verdadeira jornada de aprendizado prático. Embora eu já tivesse domínio de alguns fundamentos de programação, o contato com essa linguagem específica foi algo totalmente novo — e extremamente enriquecedor para o meu desenvolvimento profissional e pessoal.



-----------------------------------------------------------



**Architecture Question: Offline asset management system**



A arquitetura apresentada é moldada por 3 pilares centrais, a aplicação Web qual já está pronta e não será modificada, o banco de dados que também está pronto para utilização e por uma aplicação mobile que consegue operar de maneira online mas também de maneira offline. Ambas aplicações utilizarão o mesmo banco de dados, desta forma a aplicação mobile precisa ser funcional com possibilidade de consulta e modificação das informações contidas no banco de dados.



**Aplicação mobile**



Nesta aplicação, o front-end e o back-end local precisam se comunicar de forma offline, permitindo que o usuário consulte as informações obtidas na última vez em que esteve conectado à internet e, além disso, possa manipular esses dados localmente.

Essa abordagem garante a continuidade do trabalho em locais remotos, onde não há conectividade disponível.



Considerando que a aplicação Web já existente foi desenvolvida em .NET Web API, a aplicação mobile pode ser implementada utilizando .NET MAUI, o que proporciona uma integração mais fluida entre os ambientes, uma vez que ambos compartilham a mesma base tecnológica e padrões de comunicação (REST APIs).



Para o armazenamento local, será utilizado o SQLite, que oferece um banco de dados leve, embarcado e capaz de operar de forma totalmente offline.

Quando a conexão com a internet for restabelecida, os dados locais serão sincronizados com o banco de dados remoto por meio de trocas de informações em formato JSON. Essa escolha facilita o transporte e o versionamento dos dados, além de manter a compatibilidade com o banco SQL utilizado pela aplicação Web.



Em situações em que múltiplos usuários modificarem o mesmo registro (mesmo id) enquanto trabalham offline, o processo de sincronização utilizará o atributo rowstamp para comparar as versões.

Caso seja detectada uma divergência, o sistema executará uma rotina de resolução de conflito, notificando o usuário de que os dados foram atualizados recentemente e solicitando confirmação sobre a substituição ou manutenção das alterações locais.



Uma funcionalidade essencial do back-end local é o monitoramento periódico de conectividade. Essa verificação é executada em segundo plano, mesmo quando o usuário não estiver com a aplicação aberta.

Assim, o sistema pode identificar automaticamente o restabelecimento da conexão e acionar o processo de sincronização entre o banco local (SQLite) e o banco remoto (SQL Server).



A sincronização será incremental, ou seja, apenas os registros cujo atributo rowstamp tenha sido atualizado desde o último sincronismo serão baixados ou enviados, garantindo eficiência, economia de dados e melhor desempenho.

O Offline Back-end atua como uma camada intermediária de sincronização entre o aplicativo mobile e o banco de dados remoto.

Ele é responsável por processar as operações de leitura e escrita, aplicar regras de negócio localmente e gerenciar o fluxo de sincronização de forma controlada e segura.

