import {
  BedDouble,
  BrainCircuit,
  Boxes,
  ClipboardPlus,
  Hospital,
  MonitorCog,
  ShieldCheck,
  Stethoscope,
  TabletSmartphone,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type JourneyScene = {
  id: string;
  nav: string;
  eyebrow: string;
  title: string;
  body: string;
  metric: string;
  metricLabel: string;
  icon: LucideIcon;
  accent: 'cyan' | 'blue' | 'green' | 'red';
  points: string[];
  introParagraphs?: string[];
  solutionHeading?: string;
  solutions?: Array<{
    name: string;
    description: string;
  }>;
  closing?: string[];
  kicker?: string;
};

export const scenes: JourneyScene[] = [
  {
    id: 'arrival',
    nav: 'Início',
    eyebrow: 'MEDISCOPE HEALTHCARE SYSTEMS',
    title: 'Inteligência para toda a Saúde.',
    kicker: 'Hospitais Inteligentes. Cidades Inteligentes. Decisões Inteligentes.',
    body: 'O Mediscope conecta atendimento, operação, gestão e inteligência artificial em uma plataforma única para hospitais e gestão municipal mais eficientes, seguros e centrados no paciente.',
    metric: '360',
    metricLabel: 'graus de inteligencia para a saude',
    icon: Hospital,
    accent: 'cyan',
    points: ['Consultorios', 'Clinicas', 'Hospitais', 'Saude publica'],
    introParagraphs: [
      'IA Clínica',
      'Gestão em Tempo Real',
      'Experiência do Paciente',
    ],
  },
  {
    id: 'principles',
    nav: 'Princípios',
    eyebrow: 'Dados integrados',
    title: 'Tudo começa com Dados Integrados',
    kicker: 'Uma única identidade. Toda a jornada da saúde.',
    body: 'O Mediscope foi desenvolvido para eliminar um dos maiores desafios da saúde moderna: informações fragmentadas. Cada paciente possui uma identidade única, permitindo que todo o seu histórico clínico acompanhe sua jornada, independentemente da unidade de atendimento, profissional ou nível de atenção.',
    metric: '1',
    metricLabel: 'identidade unica em toda a rede',
    icon: ClipboardPlus,
    accent: 'blue',
    points: [
      'Um único cadastro para toda a rede de saúde.',
      'Fim dos cadastros repetitivos em diferentes unidades.',
      'Histórico clínico longitudinal integrado.',
      'Prontuário eletrônico unificado. Digitalizamos até mesmo o que está em papel.',
      'Identificação por CPF, Cartão SUS, QR Code, reconhecimento facial ou Aplicativo do Paciente.',
      'Acesso rápido ao histórico de consultas, exames, medicamentos, alergias e internações.',
      'Compartilhamento seguro das informações entre equipes autorizadas.',
      'Integração entre hospitais, clínicas, unidades básicas, ambulatórios e atendimento pré-hospitalar.',
    ],
    introParagraphs: [
      'Com uma arquitetura orientada à integração, a plataforma conecta dados assistenciais, administrativos e operacionais para oferecer uma visão completa, segura e inteligente da informação.',
      'Mais do que armazenar dados, o Mediscope transforma informações dispersas em conhecimento útil para apoiar profissionais, gestores e pacientes em cada etapa do cuidado.',
      'Quando a informação circula de forma inteligente, decisões acontecem com mais rapidez, segurança e qualidade.',
    ],
  },
  {
    id: 'patient-app',
    nav: 'App do Paciente',
    eyebrow: 'Experiência conectada',
    title: 'Sem paciente conectado, não há saúde inteligente',
    body: 'Um sistema completo de saúde não pode ignorar o principal interessado. O Mediscope coloca o paciente no centro da jornada, conectando dados, orientações, exames, agenda e comunicação em uma experiência simples, segura e contínua.',
    metric: '1',
    metricLabel: 'jornada conectada do paciente',
    icon: TabletSmartphone,
    accent: 'green',
    points: [
      'Histórico Médico|Consultas, internações, alergias, medicamentos e eventos relevantes em uma linha do tempo simples.',
      'Exames|Resultados organizados, notificações de novos laudos e acesso rápido ao histórico.',
      'Telemedicina|Atendimento remoto integrado à jornada clínica e ao prontuário.',
      'Prescrições|Receitas, orientações e lembretes de uso com mais clareza para o paciente.',
      'Notificações|Alertas sobre consultas, exames, retornos, medicamentos e acompanhamento.',
      'Agenda|Consultas, procedimentos e retornos reunidos em um só lugar.',
      'Comunicação|Canal seguro entre paciente, unidade de saúde e equipes autorizadas.',
      'Dispositivos inteligentes|Integração com Apple Watch, Bioimpedância, Pressão Arterial, Glicemia, Oxímetro, Atividade Física, Sono, Frequência Cardíaca e Tendências.',
    ],
    introParagraphs: [
      'O aplicativo do paciente amplia a experiência do cuidado para além das paredes do hospital.',
      'Com o Mediscope, o paciente acompanha sua jornada, acessa informações importantes, recebe notificações, consulta exames, interage com equipes autorizadas e participa ativamente do próprio cuidado.',
      'Quando o paciente participa da informação, o cuidado deixa de ser episódico e passa a ser contínuo.',
    ],
  },
  {
    id: 'clinical',
    nav: 'Consulta',
    eyebrow: 'Consulta',
    title: 'A tecnologia apoia. O médico decide.',
    body: 'Cada consulta é uma oportunidade de transformar dados em decisões mais rápidas, seguras e bem fundamentadas. O Mediscope reúne o histórico clínico do paciente, organiza informações relevantes, integra exames, prescrições, imagens e registros assistenciais em um único ambiente, permitindo que o profissional concentre seu tempo no que realmente importa: o paciente.',
    metric: 'IA',
    metricLabel: 'como copiloto clinico auditavel',
    icon: Stethoscope,
    accent: 'cyan',
    points: [
      'Histórico Clínico Integrado|Toda a trajetória assistencial do paciente reunida em uma única linha do tempo.',
      'Inteligência Artificial Clínica|Organiza informações relevantes, identifica padrões e apoia a tomada de decisão.',
      'Documentação Automatizada|Redução do tempo dedicado a registros, evoluções e documentação clínica.',
      'Exames e Imagens Integrados|Resultados laboratoriais, exames de imagem e documentos acessíveis durante a consulta.',
      'Alertas Clínicos Inteligentes|Alergias, interações medicamentosas, fatores de risco e eventos relevantes destacados automaticamente.',
      'Protocolos Assistenciais|Suporte à aplicação de protocolos clínicos e boas práticas baseadas em evidências.',
      'Prescrição Inteligente|Mais segurança na elaboração de prescrições e acompanhamento terapêutico.',
      'Visão Longitudinal do Paciente|O contexto completo da saúde do paciente, e não apenas o episódio atual de atendimento.',
    ],
    introParagraphs: [
      'Com Inteligência Artificial integrada, a plataforma auxilia na análise das informações, identifica padrões, destaca riscos clínicos e automatiza tarefas repetitivas, reduzindo o tempo gasto com burocracia e ampliando a qualidade do atendimento.',
      'Mais do que um prontuário eletrônico, o Mediscope atua como um copiloto inteligente durante toda a jornada clínica.',
      'Quando a informação trabalha a favor do médico, sobra mais tempo para cuidar das pessoas.',
    ],
  },
  {
    id: 'room',
    nav: 'Conectividade',
    eyebrow: 'Infraestrutura inteligente',
    title: 'Hospital Conectado',
    kicker: 'Quando o hospital começa a conversar com você.',
    body: 'O verdadeiro hospital inteligente vai muito além do prontuário eletrônico. Ele é capaz de perceber, interpretar e reagir ao que acontece em tempo real. O Mediscope integra equipamentos médicos, sensores inteligentes, dispositivos proprietários, rádios comunicadores, wearables e sistemas legados em uma única plataforma, criando uma infraestrutura digital capaz de transformar eventos físicos em informações estratégicas para equipes assistenciais e gestores.',
    metric: '85%',
    metricLabel: 'infraestrutura conectada em tempo real',
    icon: BedDouble,
    accent: 'blue',
    points: [
      'Digital Twin Hospitalar|Visualização tridimensional da operação hospitalar com localização de equipes, pacientes, equipamentos e ativos em tempo real.',
      'Telemetria Clínica Contínua|Monitoramento histórico e em tempo real de sinais, eventos e indicadores clínicos durante toda a internação.',
      'Integração com Equipamentos|Conectividade com monitores multiparamétricos, bombas de infusão, ventiladores, dispositivos médicos, sensores ambientais, rádios comunicadores, wearables e equipamentos inteligentes.',
      'Localização Inteligente (RTLS)|Acompanhamento da localização de profissionais, pacientes, equipamentos e ativos críticos dentro do hospital.',
      'Monitoramento Assistencial|Registro automático de eventos como permanência no leito, movimentação, ocupação, deslocamentos e outros indicadores operacionais que contribuem para análises assistenciais e de eficiência.',
      'Rastreabilidade de Medicamentos|Monitoramento da cadeia de custódia desde o almoxarifado até a administração ao paciente, ampliando a segurança e a rastreabilidade do processo.',
      'Automação Hospitalar|Sensores, dispositivos inteligentes e regras automatizadas trabalham de forma integrada para reduzir tarefas manuais e aumentar a eficiência operacional.',
      'Inteligência Operacional|Cada equipamento deixa de ser apenas um ativo físico e passa a fornecer informações estratégicas sobre utilização, disponibilidade, manutenção, consumo de insumos, custos operacionais e desempenho financeiro.',
      'Dispositivos Inteligentes Mediscope|A linha de dispositivos proprietários da Mediscope amplia as possibilidades de automação hospitalar, permitindo modernizar ambientes existentes, conectar equipamentos legados e incorporar novos sensores e funcionalidades sem a necessidade de substituir toda a infraestrutura instalada.',
    ],
    introParagraphs: [
      'Mesmo equipamentos sem conectividade nativa podem ser incorporados ao ecossistema por meio das soluções proprietárias da Mediscope, ampliando a vida útil da infraestrutura existente e acelerando a transformação digital sem a necessidade de substituir todo o parque tecnológico.',
      'Plataforma IoT Mediscope|Muito além da integração com equipamentos modernos, o Mediscope foi projetado para conectar praticamente qualquer dispositivo ao ecossistema hospitalar.|Por meio de gateways inteligentes, dispositivos proprietários e protocolos de comunicação padronizados, a plataforma integra sensores, equipamentos médicos, rádios comunicadores, wearables, dispositivos ambientais e até equipamentos legados que originalmente não possuíam recursos de conectividade.|Essa arquitetura permite transformar eventos físicos em informações clínicas e operacionais disponíveis em tempo real para profissionais, gestores e sistemas inteligentes.',
      'Ecossistema Aberto|O Mediscope foi desenvolvido com arquitetura API First, permitindo integração nativa com sistemas de saúde, ERPs, plataformas financeiras, laboratórios, equipamentos médicos e soluções de terceiros.|Por meio de APIs padronizadas, motores inteligentes de integração e ferramentas de importação de dados, a plataforma compartilha informações de forma segura, reduzindo retrabalho e preservando investimentos já realizados pelas instituições.|Além da interoperabilidade com sistemas públicos e privados, o Mediscope está preparado para integrar-se aos serviços e bases de dados do Sistema Único de Saúde (SUS), bem como exportar informações clínicas, administrativas e de faturamento para plataformas externas, respeitando os padrões e requisitos de cada ambiente.|Recursos de Integração: Arquitetura API First; Integração com sistemas públicos e privados; Motores inteligentes de importação e sincronização de dados; Comunicação com equipamentos e dispositivos médicos; Exportação de faturamento e informações administrativas; Integração com laboratórios, ERPs e plataformas corporativas; Preparado para interoperabilidade com o ecossistema do SUS; Arquitetura escalável para novas integrações.|O Mediscope não substitui o seu ecossistema. Ele conecta, organiza e potencializa tudo o que já faz parte dele.',
      'Quando equipamentos, pessoas e informações passam a operar como um único ecossistema, o hospital deixa de apenas funcionar e passa a evoluir continuamente.',
    ],
  },
  {
    id: 'emergency',
    nav: 'Inteligência Artificial',
    eyebrow: 'IA distribuída',
    title: 'Inteligência Artificial',
    kicker: 'Inteligência para acelerar decisões. Pessoas para transformar vidas.',
    body: 'A Inteligência Artificial do Mediscope não substitui profissionais. Ela potencializa sua capacidade de analisar informações, reduzir tarefas repetitivas e tomar decisões com mais rapidez e segurança.',
    metric: '14+',
    metricLabel: 'motores de IA trabalhando continuamente',
    icon: BrainCircuit,
    accent: 'cyan',
    points: [
      'Identificação facial de pacientes inconscientes.',
      'Recuperação instantânea do histórico clínico integrado.',
      'Acesso imediato a alergias, medicamentos em uso e condições pré-existentes.',
      'Início da telemedicina ainda durante o transporte na ambulância.',
      'Notificação antecipada da unidade de destino.',
      'Acionamento automático de protocolos clínicos.',
      'Mobilização inteligente de equipes e recursos antes da chegada do paciente.',
    ],
    introParagraphs: [
      'Enquanto a IA organiza dados, identifica padrões, automatiza processos e apresenta informações relevantes em segundos, médicos, enfermeiros e gestores permanecem focados no que realmente importa: cuidar de pessoas.',
      'Presente em toda a plataforma, a Inteligência Artificial acompanha a jornada completa do paciente e apoia decisões clínicas, operacionais e estratégicas em tempo real.',
      'Gestão|A mesma Inteligência Artificial que auxilia médicos também apoia gestores.|A plataforma transforma milhares de eventos operacionais em indicadores estratégicos atualizados continuamente, permitindo acompanhar o desempenho do hospital em tempo praticamente real.|Ao invés de aguardar dias ou semanas para consolidar informações, gestores acompanham a operação conforme ela acontece.|Indicadores financeiros, ocupação hospitalar, produtividade médica, utilização de equipamentos, consumo de insumos, faturamento, desempenho operacional e indicadores assistenciais permanecem disponíveis em painéis inteligentes para apoiar decisões rápidas e baseadas em dados.',
      'Inteligência Contínua|A Rede de Inteligências Especializadas do Mediscope é formada por mais de 14 motores de IA que trabalham continuamente sobre os dados da instituição, aprendendo, correlacionando informações e gerando recomendações em tempo real para todas as áreas da plataforma.|Enquanto profissionais cuidam de pessoas, essas inteligências analisam milhões de eventos registrados na plataforma, identificam padrões, acompanham indicadores, detectam riscos, correlacionam informações e produzem insights estratégicos para toda a operação.|Esse trabalho acontece de forma permanente, transformando dados clínicos, operacionais e administrativos em conhecimento útil para médicos, enfermeiros, gestores e equipes de vigilância em saúde.|Apoio à decisão clínica; Gestão hospitalar; Epidemiologia; Vigilância em Saúde; Produtividade assistencial; Gestão financeira; Regulação e filas; Farmácia e estoques; Inteligência operacional; Indicadores de qualidade; Análise preditiva; Detecção de anomalias; Apoio ao planejamento estratégico; Automação de processos.|Mais do que responder perguntas, o Mediscope trabalha continuamente para descobrir aquilo que ainda não foi percebido.',
      'A Inteligência Artificial não substitui a experiência humana. Ela elimina o tempo perdido entre a informação e a decisão.',
      'A melhor Inteligência Artificial é aquela que continua trabalhando mesmo quando ninguém está olhando.',
    ],
    solutionHeading: 'IA Distribuída',
    solutions: [
      {
        name: 'Assistência Clínica',
        description: 'Organiza informações, identifica padrões e apoia decisões médicas.',
      },
      {
        name: 'Documentação Inteligente',
        description: 'Gravação, transcrição e organização automática de informações clínicas.',
      },
      {
        name: 'Automação Hospitalar',
        description: 'Redução de tarefas repetitivas e execução automática de processos.',
      },
      {
        name: 'Gestão Inteligente',
        description: 'Análise contínua de indicadores administrativos, financeiros e assistenciais.',
      },
      {
        name: 'Análise Preditiva',
        description: 'Identificação antecipada de riscos clínicos e operacionais.',
      },
      {
        name: 'Copiloto para Gestores',
        description: 'Transformação de grandes volumes de dados em informações úteis para tomada de decisão.',
      },
    ],
  },
  {
    id: 'inventory',
    nav: 'Inteligência de Gestão',
    eyebrow: 'Gestão inteligente',
    title: 'Inteligência de Gestão',
    kicker: 'Quando todos os dados trabalham juntos, a gestão deixa de olhar para o passado e passa a enxergar o futuro.',
    body: 'Administrar uma instituição de saúde exige muito mais do que controlar estoques ou acompanhar indicadores financeiros. É necessário compreender como cada decisão impacta custos, produtividade, qualidade assistencial e sustentabilidade da operação.',
    metric: '100%',
    metricLabel: 'rastreabilidade de recursos críticos',
    icon: Boxes,
    accent: 'green',
    points: [
      'Custos de aquisição',
      'Consumo de insumos',
      'Custos de manutenção',
      'Consumo energético',
      'Tempo de utilização',
      'Disponibilidade operacional',
      'Produtividade assistencial',
      'Receita gerada',
      'Margem operacional',
      'Retorno sobre investimento (ROI)',
    ],
    introParagraphs: [
      'O Mediscope integra informações clínicas, operacionais, administrativas e financeiras em uma única plataforma, permitindo que gestores acompanhem toda a instituição em tempo real e tomem decisões baseadas em dados concretos.',
      'Cada atendimento, medicamento, equipamento, profissional e procedimento passa a contribuir para uma visão completa da operação.',
      'Inteligência Operacional|O Mediscope permite compreender o desempenho de qualquer recurso da instituição.|Cada equipamento, setor, equipe ou profissional deixa de ser apenas um centro de custo e passa a ser analisado como uma unidade operacional completa.|Essa inteligência permite identificar oportunidades de otimização, apoiar decisões de investimento e compreender com precisão quais recursos geram maior impacto assistencial e financeiro.',
      'Indicadores em Tempo Real|A informação não precisa esperar o fechamento do mês.|O Mediscope consolida continuamente eventos administrativos, assistenciais e financeiros para oferecer uma visão atualizada da operação.|Gestores acompanham indicadores praticamente em tempo real, permitindo respostas rápidas às mudanças do hospital e reduzindo o intervalo entre o acontecimento e a tomada de decisão.',
      'Gestão Baseada em Inteligência|Mais do que apresentar números, o Mediscope identifica tendências, relaciona informações entre diferentes áreas e gera recomendações para apoiar decisões estratégicas em toda a instituição.|A gestão deixa de trabalhar apenas com relatórios históricos e passa a contar com análises contínuas orientadas por Inteligência Artificial.',
      'Rastreabilidade Inteligente|Cada medicamento, insumo, equipamento ou ativo hospitalar pode ser acompanhado durante toda a sua jornada.|O Mediscope oferece suporte a diferentes tecnologias de identificação, incluindo RFID, códigos de barras, QR Codes e outros mecanismos de rastreabilidade, permitindo que instituições adotem a tecnologia mais adequada para sua realidade operacional.|Cada movimentação é registrada automaticamente, criando uma cadeia de informações confiável desde o recebimento do material até sua utilização no paciente.',
      'Cadeia de Custódia de Medicamentos|A segurança do paciente começa muito antes da administração do medicamento.|Recebimento do fornecedor; Controle de lotes e validade; Armazenamento; Transferências entre estoques; Separação para atendimento; Distribuição às unidades; Preparação da medicação; Conferência de segurança; Administração à beira do leito; Registro automático no prontuário|Cada movimentação permanece documentada, garantindo rastreabilidade completa e ampliando a segurança assistencial.',
      'Gestão Inteligente de Recursos|Mais do que localizar ativos, o Mediscope transforma recursos físicos em informações estratégicas.|Localização de equipamentos em tempo real; Histórico completo de movimentações; Disponibilidade operacional; Controle de empréstimos entre setores; Inventários automatizados; Vida útil dos ativos; Manutenções preventivas e corretivas; Custos operacionais; Taxa de utilização; Indicadores de produtividade|Com isso, equipamentos deixam de permanecer ociosos ou desaparecidos dentro da instituição e passam a integrar uma gestão baseada em dados.',
      'Conhecer os números é importante. Entender o que eles significam é o que transforma a gestão.',
      'Quando cada recurso possui identidade, localização e histórico, a gestão deixa de depender de processos manuais e passa a operar com precisão.',
    ],
    solutionHeading: 'Gestão Integrada',
    solutions: [
      {
        name: 'Compras Inteligentes',
        description: 'Planejamento de aquisições baseado em consumo real, previsões de demanda e níveis de estoque.',
      },
      {
        name: 'Gestão de Estoques',
        description: 'Controle de entradas, saídas, validade, lotes, inventários, múltiplos almoxarifados e rastreabilidade completa.',
      },
      {
        name: 'Recursos Humanos',
        description: 'Produtividade, escalas, desempenho das equipes, custos assistenciais e indicadores por profissional, setor ou unidade.',
      },
      {
        name: 'Faturamento Inteligente',
        description: 'Produção assistencial, faturamento, glosas, receitas e indicadores financeiros em tempo praticamente real.',
      },
      {
        name: 'Análise Financeira',
        description: 'Custos, receitas, margens, rentabilidade e desempenho financeiro em painéis inteligentes.',
      },
    ],
  },
  {
    id: 'command',
    nav: 'Gestao',
    eyebrow: 'Comando institucional',
    title: 'Gestores enxergam o hospital como um organismo unico.',
    body: 'Indicadores clinicos, financeiros, assistenciais e publicos se encontram em paineis executivos para decisao rapida e governanca confiavel.',
    metric: '1.248',
    metricLabel: 'ativos sob monitoramento',
    icon: MonitorCog,
    accent: 'blue',
    points: ['Ocupacao e fluxo', 'SLA e qualidade', 'Saude publica e regulacao'],
  },
  {
    id: 'cta',
    nav: 'Institucional',
    eyebrow: 'Mediscope Healthcare Systems',
    title: 'Tecnologia que salva vidas tambem precisa organizar sistemas inteiros.',
    body: 'Uma plataforma premium para instituicoes que querem operar com precisao, transparencia e inteligencia assistencial de ponta a ponta.',
    metric: 'M',
    metricLabel: 'Mediscope como infraestrutura de cuidado',
    icon: ShieldCheck,
    accent: 'green',
    points: ['Hospitais', 'Redes publicas', 'Operadoras e gestores'],
  },
];
