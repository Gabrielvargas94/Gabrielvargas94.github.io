// All copy for the site in EN / ES / PT.
// Access via t(key) once a language is selected.

window.TRANSLATIONS = {
  en: {
    nav: {
      work: "My Work",
      ai: "My Work with AI",
      hobbies: "My Hobbies",
      cta: "Contact me on LinkedIn",
    },
    hero: {
      eyebrow: "Head of Engineering",
      title_pre: "Building",
      title_em: "AI-first",
      title_post: "engineering teams",
      subtitle:
        "I lead engineering organizations through the transition from craft to AI-augmented delivery — at scale, in production, with humans still in the loop.",
      cta: "Let's talk on LinkedIn",
      meta_loc: "Asunción, Paraguay",
      meta_remote: "Remote",
      meta_years: "12+ years",
      scroll: "Scroll",
    },
    itti: {
      tag: "Currently",
      title: "Two products. One playbook.",
      body:
        "As Software Engineering Manager at itti, I oversee strategic engineering across two flagship products in the same ecosystem — and embed in the core team driving the company's AI adoption.",
      bullets: [
        "Architectural transformation of a high-concurrency mobile platform (React Native + Java microservices on AWS & GCP).",
        "Micro-apps architecture decoupling deployments — independent team velocity, fewer cross-team bottlenecks.",
        "AI-assisted development practices (Claude Code, Cursor, Copilot, Superpowers) rolled out across 12+ engineers.",
        "Code review culture, observability, incident response — production-grade reliability.",
      ],
      monchis: {
        tag: "Delivery",
        name: "Monchis",
        sub: "Jul 2024 — Dec 2024",
        body:
          "Full architectural redesign of the mobile platform. Stability + performance gains that moved retention. Earned the internal mandate to replicate it at greater scale on muv.",
      },
      muv: {
        tag: "Ride-hailing",
        name: "muv",
        sub: "Dec 2024 — Present",
        body:
          "Led architectural transformation of a high-concurrency platform. Stability + NPS up, delivery cycles accelerated by AI-assisted development across the 12-person team.",
      },
    },
    meli: {
      tag: "2022 — 2024",
      title: "Project Leader at Mercado Libre",
      subtitle:
        "Led teams of 8 and 12 engineers across design, delivery, and execution — owning roadmap and performance while collaborating with technical leads on architecture.",
      cards: [
        {
          tag: "01",
          title: "Transfer & Debts Tools",
          body:
            "Multi-million-dollar batch workloads at the core of MercadoPago's operations.",
        },
        {
          tag: "02",
          title: "Centralized Dashboard",
          body:
            "A single platform consolidating data across all business units. Trusted by 100+ internal teams for high-stakes financial operations.",
        },
        {
          tag: "03",
          title: "Technical Framework",
          body:
            "Drove adoption + evolution of a frontend framework used as a core standard across the organization.",
        },
        {
          tag: "04",
          title: "Team Performance",
          body:
            "Owned hiring, growth, and roadmap for two engineering teams across multi-quarter delivery cycles.",
        },
      ],
    },
    idb: {
      tag: "2020 — 2023 · Contract",
      title: "Engineering Manager",
      org: "Inter-American Development Bank",
      lede:
        "Delivered engineering across multiple projects at one of the world's most influential multilateral development banks.",
      stats: [
        { n: "60+", l: "people across engineering, design, product & policy" },
        { n: "30%", l: "reduction in time-to-market via tech-debt + microfrontends" },
        { n: "C-level", l: "audience for technical strategy + roadmap influence" },
      ],
      body:
        "Engaged initially as a full-time consultant, then continued as a flexible contractor leading internal projects — a structure that allowed concurrent engagement with Mercado Libre from May 2022 onward.",
    },
    aiIntro: {
      kicker: "My work with AI",
      title: "Not a hype cycle. A new operating model.",
      body:
        "I've spent the last two years rewiring how engineering organizations ship — moving teams from prompt-curious to production-ready, with the management practices to keep the lights on when an AI causes the incident.",
    },
    lectures: {
      tag: "Speaking",
      title: "Lectures for engineers and managers",
      body:
        "Talks aimed at both engineering teams and management — not just \"how to go AI-first,\" but how to solve the management-scope problems that come with it.",
      talks: [
        {
          n: "01",
          title: "Harness & Agentic Workflows",
          body:
            "How to build, harness and ship agentic workflows that survive production.",
        },
        {
          n: "02",
          title: "Management in an AI-First world",
          body:
            "Reviewing code, recovering from incidents the AI caused, managing secrets, integrating harness, designing agentic workflows — the operational reality.",
        },
      ],
    },
    ittiAi: {
      tag: "itti — AI Transformation",
      title: "Rolling out Claude Code at company scale",
      body:
        "Embedded in a core team of <40 people driving itti's AI adoption strategy — rolling out Claude Code, Cursor, and AI-assisted development practices across the broader engineering organization.",
      points: [
        "Tooling rollout: Claude Code, Cursor, Copilot, Superpowers.",
        "Operating practices: code review for AI-generated code, incident response when the AI caused it, secrets hygiene.",
        "Harness integration & agentic workflow design as a product, not a side experiment.",
        "Manager enablement — talks and playbooks for engineering leadership across the org.",
      ],
    },
    side: {
      tag: "Side Project",
      title: "An AI companion for tabletop role-playing",
      lede:
        "A chat-based companion that has the full know-how of D&D, Pathfinder, Vampire the Masquerade and more — lore, rules, settings — so people don't have to read a thousand books to play.",
      cards: [
        {
          tag: "Character",
          title: "Build a character",
          body:
            "Players with zero rules knowledge can roll a character that actually fits the campaign.",
        },
        {
          tag: "DM",
          title: "Co-DM at the table",
          body:
            "A second Dungeon Master in the chair — improvising NPCs, rulings, encounter math on the fly.",
        },
        {
          tag: "Convert",
          title: "Cross-ruleset translation",
          body:
            "Move a campaign from D&D to another system, or Forgotten Realms to a different setting — without losing the soul.",
        },
        {
          tag: "Tech",
          title: "Graph-per-tenant architecture",
          body:
            "Every campaign has its own knowledge graph; a translation layer bridges graphs that aren't compatible.",
        },
        {
          tag: "Agents",
          title: "Agent-as-a-Service",
          body:
            "Not just a SaaS — custom tools, harness in-code and as product, programmed workflows, Claude + GPT used as APIs.",
        },
        {
          tag: "Stack",
          title: "Built with the toolbox I preach",
          body:
            "Claude Code, custom MCP tools, evaluations, observability. The same stack I roll out at work.",
        },
      ],
    },
    certs: {
      tag: "Certifications",
      title: "Trained on the stack I deploy",
      body:
        "Anthropic curriculum — completed and in progress. Receipts, not vibes.",
      done: "Completed",
      progress: "In progress",
      items: [
        { name: "Claude 101", status: "done", date: "Apr 2026" },
        { name: "Claude Code 101", status: "done", date: "Apr 2026" },
        { name: "Claude Code in Action", status: "done", date: "Apr 2026" },
        { name: "Introduction to Agent Skills", status: "done", date: "Apr 2026" },
        { name: "Introduction to Subagents", status: "done", date: "Apr 2026" },
        { name: "Introduction to Model Context Protocol", status: "done", date: "May 2026" },
        { name: "Model Context Protocol: Advanced Topics", status: "progress", date: "4 / 15 lessons" },
        { name: "Building with the Claude API", status: "progress", date: "0 / 85 lessons" },
      ],
    },
    hobbiesIntro: {
      kicker: "Off the clock",
      title: "What I do when I'm not shipping software",
    },
    dnd: {
      tag: "Dungeons & Dragons",
      title: "Dungeon Master, side-project founder",
      body:
        "I run D&D campaigns for friends — organizing people, using creativity, and remembering to have fun. The companion above started from that table.",
      pulls: [
        { k: "Org", v: "Wrangling humans on a schedule" },
        { k: "Craft", v: "Story, pacing, improv" },
        { k: "Joy", v: "Why I started the side project" },
      ],
    },
    spirit: {
      tag: "Spirituality",
      title: "Non-duality, in practice",
      body:
        "I'm a studious person — my focus is on non-duality, and I apply it to my life. Deconstructing myself, getting closer to being a happier, more complete, kinder person.",
      pull: "Less to defend, more to give.",
    },
    contact: {
      kicker: "End of the page",
      title_pre: "Want to know",
      title_em: "more about me?",
      body: "I read every message. The CTA is right here.",
      cta: "Contact me on LinkedIn",
      foot: "Gabriel Vargas · Asunción · Remote-friendly · ES · EN · PT",
    },
    common: {
      langLabel: "Language",
    },
  },
  es: {
    nav: {
      work: "Mi Trabajo",
      ai: "Mi Trabajo con IA",
      hobbies: "Mis Hobbies",
      cta: "Contactame en LinkedIn",
    },
    hero: {
      eyebrow: "Head of Engineering",
      title_pre: "Construyendo equipos",
      title_em: "AI-first",
      title_post: "de ingeniería",
      subtitle:
        "Lidero organizaciones de ingeniería en su transición del artesanal al delivery aumentado por IA — a escala, en producción, con las personas todavía en el loop.",
      cta: "Hablemos en LinkedIn",
      meta_loc: "Asunción, Paraguay",
      meta_remote: "Remoto",
      meta_years: "12+ años",
      scroll: "Bajá",
    },
    itti: {
      tag: "Actualmente",
      title: "Dos productos. Un mismo playbook.",
      body:
        "Como Software Engineering Manager en itti, superviso la ingeniería estratégica de dos productos del mismo ecosistema — y estoy embebido en el equipo core que conduce la adopción de IA de la compañía.",
      bullets: [
        "Transformación arquitectónica de una plataforma móvil de alta concurrencia (React Native + microservicios Java en AWS y GCP).",
        "Arquitectura de micro-apps que desacopla los deploys — más velocidad por equipo, menos cuellos de botella.",
        "Prácticas de desarrollo asistido por IA (Claude Code, Cursor, Copilot, Superpowers) en un equipo de 12+ ingenieros.",
        "Cultura de code review, observabilidad, respuesta a incidentes — confiabilidad nivel producción.",
      ],
      monchis: {
        tag: "Delivery",
        name: "Monchis",
        sub: "Jul 2024 — Dic 2024",
        body:
          "Rediseño arquitectónico completo de la plataforma móvil. Estabilidad + performance que movieron la retención. Me llevó al mandato interno de replicarlo a mayor escala en muv.",
      },
      muv: {
        tag: "Ride-hailing",
        name: "muv",
        sub: "Dic 2024 — Presente",
        body:
          "Lideré la transformación arquitectónica de una plataforma de alta concurrencia. Estabilidad + NPS arriba, ciclos de delivery acelerados por desarrollo asistido por IA en un equipo de 12 personas.",
      },
    },
    meli: {
      tag: "2022 — 2024",
      title: "Project Leader en Mercado Libre",
      subtitle:
        "Lideré equipos de 8 y 12 ingenieros entre diseño, delivery y ejecución — dueño del roadmap y la performance, colaborando con tech leads en decisiones de arquitectura.",
      cards: [
        {
          tag: "01",
          title: "Tools de Transferencias y Deudas",
          body:
            "Cargas de trabajo batch multimillonarias, en el core operativo de MercadoPago.",
        },
        {
          tag: "02",
          title: "Dashboard Centralizado",
          body:
            "Plataforma que consolidaba data de todas las unidades del negocio. Usada por 100+ equipos internos para operaciones financieras críticas.",
        },
        {
          tag: "03",
          title: "Framework Técnico",
          body:
            "Impulsé la adopción y evolución de un framework de frontend usado como estándar core en toda la organización.",
        },
        {
          tag: "04",
          title: "Performance de Equipos",
          body:
            "Dueño del hiring, crecimiento y roadmap de dos equipos de ingeniería a lo largo de varios trimestres.",
        },
      ],
    },
    idb: {
      tag: "2020 — 2023 · Contrato",
      title: "Engineering Manager",
      org: "Banco Interamericano de Desarrollo",
      lede:
        "Entregué ingeniería en múltiples proyectos en uno de los bancos multilaterales de desarrollo más influyentes del mundo.",
      stats: [
        { n: "60+", l: "personas entre ingeniería, diseño, producto y políticas" },
        { n: "30%", l: "menos time-to-market gracias a deuda técnica + microfrontends" },
        { n: "C-level", l: "audiencia para estrategia técnica e influencia en el roadmap" },
      ],
      body:
        "Empecé como consultor full-time y continué como contratista flexible liderando proyectos internos — una estructura que me permitió trabajar en paralelo con Mercado Libre desde mayo de 2022.",
    },
    aiIntro: {
      kicker: "Mi trabajo con IA",
      title: "No es un ciclo de hype. Es un nuevo modelo operativo.",
      body:
        "Llevo dos años recableando cómo entregan las organizaciones de ingeniería — moviendo equipos de la curiosidad por los prompts al estar listos para producción, con las prácticas de management para mantener todo en pie cuando una IA es la que rompió.",
    },
    lectures: {
      tag: "Charlas",
      title: "Charlas para ingenieros y para managers",
      body:
        "Charlas orientadas a equipos técnicos y de management — no solo cómo ir a \"AI-First\", sino cómo resolver los problemas de management scope que vienen con eso.",
      talks: [
        {
          n: "01",
          title: "Harness y Workflows Agénticos",
          body:
            "Cómo construir, harness-ar y poner en producción workflows agénticos que sobreviven.",
        },
        {
          n: "02",
          title: "Management en un mundo AI-First",
          body:
            "Revisar código, recuperarse de incidentes que produjo la IA, gestionar secrets, integrar harness, diseñar workflows agénticos — la realidad operativa.",
        },
      ],
    },
    ittiAi: {
      tag: "itti — Transformación AI",
      title: "Llevando Claude Code a toda la empresa",
      body:
        "Embebido en un equipo core de <40 personas que conduce la estrategia de adopción de IA en itti — rollout de Claude Code, Cursor y prácticas de desarrollo asistido por IA en toda la organización de ingeniería.",
      points: [
        "Rollout de tooling: Claude Code, Cursor, Copilot, Superpowers.",
        "Prácticas operativas: code review para código de IA, respuesta a incidentes causados por IA, higiene de secrets.",
        "Integración de harness y diseño de workflows agénticos como producto — no como experimento.",
        "Habilitación de managers — charlas y playbooks para el leadership de toda la organización.",
      ],
    },
    side: {
      tag: "Side Project",
      title: "Un companion de IA para juegos de rol",
      lede:
        "Un chat con el know-how completo de D&D, Pathfinder, Vampiro la Mascarada y más — lore, reglas, ambientaciones — para que la gente no tenga que leerse miles de libros para jugar.",
      cards: [
        {
          tag: "Personaje",
          title: "Crear un personaje",
          body:
            "Jugadores sin idea de las reglas pueden armar un personaje que encaje en la campaña.",
        },
        {
          tag: "DM",
          title: "Co-DM en la mesa",
          body:
            "Un segundo Dungeon Master al lado — improvisando NPCs, fallos y math de encuentros al vuelo.",
        },
        {
          tag: "Convertir",
          title: "Traducción entre rulesets",
          body:
            "Mover una campaña de D&D a otro sistema, o de Forgotten Realms a otra ambientación — sin perder el alma.",
        },
        {
          tag: "Tech",
          title: "Arquitectura de grafo por tenant",
          body:
            "Cada campaña tiene su propio grafo de conocimiento; una capa de traducción une grafos no compatibles.",
        },
        {
          tag: "Agentes",
          title: "Agent-as-a-Service",
          body:
            "No es solo un SaaS — herramientas custom, harness en el código y como producto, workflows programados, Claude + GPT usados como APIs.",
        },
        {
          tag: "Stack",
          title: "Construido con la caja de herramientas que predico",
          body:
            "Claude Code, MCP tools custom, evals, observabilidad. El mismo stack que despliego en el trabajo.",
        },
      ],
    },
    certs: {
      tag: "Certificaciones",
      title: "Formado en el stack que despliego",
      body:
        "Currículum de Anthropic — completado y en curso. Comprobantes, no vibes.",
      done: "Completado",
      progress: "En curso",
      items: [
        { name: "Claude 101", status: "done", date: "Abr 2026" },
        { name: "Claude Code 101", status: "done", date: "Abr 2026" },
        { name: "Claude Code in Action", status: "done", date: "Abr 2026" },
        { name: "Introduction to Agent Skills", status: "done", date: "Abr 2026" },
        { name: "Introduction to Subagents", status: "done", date: "Abr 2026" },
        { name: "Introduction to Model Context Protocol", status: "done", date: "May 2026" },
        { name: "Model Context Protocol: Advanced Topics", status: "progress", date: "4 / 15 lecciones" },
        { name: "Building with the Claude API", status: "progress", date: "0 / 85 lecciones" },
      ],
    },
    hobbiesIntro: {
      kicker: "Fuera del horario",
      title: "Lo que hago cuando no estoy entregando software",
    },
    dnd: {
      tag: "Dungeons & Dragons",
      title: "Dungeon Master, fundador del side project",
      body:
        "Llevo campañas de D&D con amigos — organizando gente, usando creatividad y acordándome de divertirme. El companion de arriba nació de esa mesa.",
      pulls: [
        { k: "Org", v: "Coordinar humanos en una agenda" },
        { k: "Oficio", v: "Historia, pacing, improvisación" },
        { k: "Joy", v: "Por qué arranqué el side project" },
      ],
    },
    spirit: {
      tag: "Espiritualidad",
      title: "No-dualidad, en la práctica",
      body:
        "Soy una persona muy estudiosa — mi foco está en la no-dualidad, y la aplico en mi vida. Deconstruyéndome, acercándome a ser una persona más feliz, completa y buena.",
      pull: "Menos para defender, más para dar.",
    },
    contact: {
      kicker: "Final de página",
      title_pre: "¿Querés saber",
      title_em: "más sobre mí?",
      body: "Leo cada mensaje. El CTA está acá mismo.",
      cta: "Contactame en LinkedIn",
      foot: "Gabriel Vargas · Asunción · Remote-friendly · ES · EN · PT",
    },
    common: {
      langLabel: "Idioma",
    },
  },
  pt: {
    nav: {
      work: "Meu Trabalho",
      ai: "Meu Trabalho com IA",
      hobbies: "Meus Hobbies",
      cta: "Fale comigo no LinkedIn",
    },
    hero: {
      eyebrow: "Head of Engineering",
      title_pre: "Construindo times",
      title_em: "AI-first",
      title_post: "de engenharia",
      subtitle:
        "Lidero organizações de engenharia na transição do artesanal para o delivery aumentado por IA — em escala, em produção, com as pessoas ainda no loop.",
      cta: "Vamos conversar no LinkedIn",
      meta_loc: "Asunción, Paraguai",
      meta_remote: "Remoto",
      meta_years: "12+ anos",
      scroll: "Desça",
    },
    itti: {
      tag: "Atualmente",
      title: "Dois produtos. Um mesmo playbook.",
      body:
        "Como Software Engineering Manager na itti, superviso a engenharia estratégica de dois produtos do mesmo ecossistema — e estou embarcado no time core que conduz a adoção de IA da empresa.",
      bullets: [
        "Transformação arquitetural de uma plataforma móvel de alta concorrência (React Native + microsserviços Java em AWS e GCP).",
        "Arquitetura de micro-apps que desacopla deploys — mais velocidade por time, menos gargalos.",
        "Práticas de desenvolvimento assistido por IA (Claude Code, Cursor, Copilot, Superpowers) em um time de 12+ engenheiros.",
        "Cultura de code review, observabilidade, resposta a incidentes — confiabilidade nível produção.",
      ],
      monchis: {
        tag: "Delivery",
        name: "Monchis",
        sub: "Jul 2024 — Dez 2024",
        body:
          "Redesenho arquitetural completo da plataforma móvel. Ganhos de estabilidade e performance que moveram a retenção. Me rendeu o mandato interno de replicar em maior escala na muv.",
      },
      muv: {
        tag: "Ride-hailing",
        name: "muv",
        sub: "Dez 2024 — Presente",
        body:
          "Liderei a transformação arquitetural de uma plataforma de alta concorrência. Estabilidade + NPS pra cima, ciclos de delivery acelerados por desenvolvimento assistido por IA em um time de 12 pessoas.",
      },
    },
    meli: {
      tag: "2022 — 2024",
      title: "Project Leader no Mercado Libre",
      subtitle:
        "Liderei times de 8 e 12 engenheiros entre design, delivery e execução — dono do roadmap e da performance, colaborando com tech leads em decisões de arquitetura.",
      cards: [
        {
          tag: "01",
          title: "Tools de Transferências e Dívidas",
          body:
            "Cargas batch multimilionárias, no core operacional do MercadoPago.",
        },
        {
          tag: "02",
          title: "Dashboard Centralizado",
          body:
            "Plataforma consolidando dados de todas as unidades de negócio. Usada por 100+ times internos em operações financeiras críticas.",
        },
        {
          tag: "03",
          title: "Framework Técnico",
          body:
            "Conduzi a adoção e evolução de um framework de frontend usado como padrão core em toda a organização.",
        },
        {
          tag: "04",
          title: "Performance dos Times",
          body:
            "Dono de contratação, crescimento e roadmap de dois times de engenharia ao longo de vários trimestres.",
        },
      ],
    },
    idb: {
      tag: "2020 — 2023 · Contrato",
      title: "Engineering Manager",
      org: "Banco Interamericano de Desenvolvimento",
      lede:
        "Entreguei engenharia em múltiplos projetos em um dos bancos multilaterais de desenvolvimento mais influentes do mundo.",
      stats: [
        { n: "60+", l: "pessoas entre engenharia, design, produto e políticas" },
        { n: "30%", l: "menos time-to-market via dívida técnica + microfrontends" },
        { n: "C-level", l: "público para estratégia técnica e influência no roadmap" },
      ],
      body:
        "Comecei como consultor full-time e segui como contratado flexível liderando projetos internos — estrutura que me permitiu engajamento simultâneo com o Mercado Libre desde maio de 2022.",
    },
    aiIntro: {
      kicker: "Meu trabalho com IA",
      title: "Não é ciclo de hype. É um novo modelo operacional.",
      body:
        "Passei os últimos dois anos recabeando como organizações de engenharia entregam — movendo times de curiosos sobre prompts a prontos para produção, com as práticas de management para manter tudo em pé quando uma IA é a culpada pelo incidente.",
    },
    lectures: {
      tag: "Palestras",
      title: "Palestras para engenheiros e managers",
      body:
        "Palestras voltadas para times técnicos e de management — não só \"como ir AI-First\", mas como resolver os problemas de management scope que vêm junto.",
      talks: [
        {
          n: "01",
          title: "Harness e Workflows Agênticos",
          body:
            "Como construir, harness-ar e levar para produção workflows agênticos que sobrevivem.",
        },
        {
          n: "02",
          title: "Management num mundo AI-First",
          body:
            "Revisar código, se recuperar de incidentes causados pela IA, gerenciar secrets, integrar harness, desenhar workflows agênticos — a realidade operacional.",
        },
      ],
    },
    ittiAi: {
      tag: "itti — Transformação AI",
      title: "Levando Claude Code para toda a empresa",
      body:
        "Embarcado em um time core de <40 pessoas que conduz a estratégia de adoção de IA na itti — rollout de Claude Code, Cursor e práticas de desenvolvimento assistido por IA em toda a organização de engenharia.",
      points: [
        "Rollout de tooling: Claude Code, Cursor, Copilot, Superpowers.",
        "Práticas operacionais: code review para código de IA, resposta a incidentes causados por IA, higiene de secrets.",
        "Integração de harness e design de workflows agênticos como produto — não como experimento.",
        "Habilitação de managers — palestras e playbooks para a liderança de toda a organização.",
      ],
    },
    side: {
      tag: "Side Project",
      title: "Um companion de IA para RPG de mesa",
      lede:
        "Um chat com o know-how completo de D&D, Pathfinder, Vampire the Masquerade e mais — lore, regras, ambientações — para as pessoas não precisarem ler mil livros para jogar.",
      cards: [
        {
          tag: "Personagem",
          title: "Criar um personagem",
          body:
            "Jogadores sem ideia das regras podem montar um personagem que encaixa na campanha.",
        },
        {
          tag: "DM",
          title: "Co-DM na mesa",
          body:
            "Um segundo Dungeon Master ao lado — improvisando NPCs, decisões e math de encontros no voo.",
        },
        {
          tag: "Converter",
          title: "Tradução entre rulesets",
          body:
            "Mover uma campanha de D&D para outro sistema, ou Forgotten Realms para outra ambientação — sem perder a alma.",
        },
        {
          tag: "Tech",
          title: "Arquitetura de grafo por tenant",
          body:
            "Cada campanha tem seu próprio grafo de conhecimento; uma camada de tradução une grafos incompatíveis.",
        },
        {
          tag: "Agentes",
          title: "Agent-as-a-Service",
          body:
            "Não é só um SaaS — ferramentas custom, harness no código e como produto, workflows programados, Claude + GPT usados como APIs.",
        },
        {
          tag: "Stack",
          title: "Construído com a caixa de ferramentas que prego",
          body:
            "Claude Code, MCP tools custom, evals, observabilidade. O mesmo stack que aplico no trabalho.",
        },
      ],
    },
    certs: {
      tag: "Certificações",
      title: "Formado no stack que aplico",
      body:
        "Currículo da Anthropic — concluído e em andamento. Comprovantes, não vibes.",
      done: "Concluído",
      progress: "Em andamento",
      items: [
        { name: "Claude 101", status: "done", date: "Abr 2026" },
        { name: "Claude Code 101", status: "done", date: "Abr 2026" },
        { name: "Claude Code in Action", status: "done", date: "Abr 2026" },
        { name: "Introduction to Agent Skills", status: "done", date: "Abr 2026" },
        { name: "Introduction to Subagents", status: "done", date: "Abr 2026" },
        { name: "Introduction to Model Context Protocol", status: "done", date: "Mai 2026" },
        { name: "Model Context Protocol: Advanced Topics", status: "progress", date: "4 / 15 lições" },
        { name: "Building with the Claude API", status: "progress", date: "0 / 85 lições" },
      ],
    },
    hobbiesIntro: {
      kicker: "Fora do expediente",
      title: "O que faço quando não estou entregando software",
    },
    dnd: {
      tag: "Dungeons & Dragons",
      title: "Dungeon Master, fundador do side project",
      body:
        "Toco campanhas de D&D com amigos — organizando gente, usando criatividade e lembrando de me divertir. O companion acima nasceu dessa mesa.",
      pulls: [
        { k: "Org", v: "Coordenar humanos numa agenda" },
        { k: "Ofício", v: "História, pacing, improviso" },
        { k: "Joy", v: "Por que comecei o side project" },
      ],
    },
    spirit: {
      tag: "Espiritualidade",
      title: "Não-dualidade, na prática",
      body:
        "Sou uma pessoa muito estudiosa — meu foco é a não-dualidade, e a aplico na minha vida. Me desconstruindo, me aproximando de ser uma pessoa mais feliz, completa e boa.",
      pull: "Menos para defender, mais para dar.",
    },
    contact: {
      kicker: "Fim da página",
      title_pre: "Quer saber",
      title_em: "mais sobre mim?",
      body: "Leio cada mensagem. O CTA está bem aqui.",
      cta: "Fale comigo no LinkedIn",
      foot: "Gabriel Vargas · Asunción · Remote-friendly · ES · EN · PT",
    },
    common: {
      langLabel: "Idioma",
    },
  },
};
