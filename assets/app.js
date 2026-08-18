  (() => {
    const root = document.getElementById('ac-landing-preview');
    if (!root) return;
    root.querySelector('[data-ac-action="approve"]')?.addEventListener('click', async () => {
      if (window.openai?.sendFollowUpMessage) {
        await window.openai.sendFollowUpMessage({
          title: 'Aprovar direção visual',
          prompt: 'Aprovo a direção visual e a estrutura da landing page de marketing olfativo. Vamos seguir para os ajustes finais e depois montar no Wix.'
        });
      }
    });
    root.querySelector('[data-ac-action="changes"]')?.addEventListener('click', async () => {
      if (window.openai?.sendFollowUpMessage) {
        await window.openai.sendFollowUpMessage({
          title: 'Solicitar alterações',
          prompt: 'Quero pedir alterações no protótipo da landing page de marketing olfativo. Me ajude a revisar por seção.'
        });
      }
    });

    const quiz = root.querySelector('.ac-scent-quiz');
    if (quiz) {
      const form = quiz.querySelector('.ac-quiz-form');
      const steps = [...quiz.querySelectorAll('[data-ac-quiz-step]')];
      const progress = quiz.querySelector('.ac-quiz-progress');
      const progressLabel = quiz.querySelector('.ac-quiz-progress-label');
      const progressFill = quiz.querySelector('.ac-quiz-progress-track i');
      const stepLabel = quiz.querySelector('.ac-quiz-step-label');
      const backButton = quiz.querySelector('.ac-quiz-back');
      const nextButton = quiz.querySelector('.ac-quiz-next');
      const result = quiz.querySelector('.ac-quiz-result');
      const restartButton = quiz.querySelector('.ac-quiz-restart');
      const answers = {};
      let currentStep = 0;

      const profiles = {
        acolhimento: {
          name: 'acolhimento',
          family: 'Floral amadeirada confortável',
          notes: ['bergamota', 'chá branco', 'cedro', 'musk'],
          palette: ['#b99578', '#ead8c7', '#655044'],
          summary: 'conforto e proximidade com uma base elegante e tranquila'
        },
        energia: {
          name: 'energia',
          family: 'Cítrica aromática luminosa',
          notes: ['grapefruit', 'petitgrain', 'capim-limão', 'chá verde'],
          palette: ['#c6a252', '#efe0a9', '#687452'],
          summary: 'vitalidade e movimento sem perder a sofisticação da marca'
        },
        sofisticacao: {
          name: 'sofisticação',
          family: 'Amadeirada âmbar refinada',
          notes: ['bergamota', 'íris', 'sândalo', 'âmbar'],
          palette: ['#765642', '#c6a17c', '#2d2723'],
          summary: 'profundidade, exclusividade e uma presença olfativa refinada'
        },
        frescor: {
          name: 'frescor',
          family: 'Cítrica fresca almiscarada',
          notes: ['bergamota', 'chá branco', 'folhas verdes', 'musk'],
          palette: ['#9ebbb5', '#e0e9e5', '#496863'],
          summary: 'clareza, leveza e uma sensação contínua de ambiente bem cuidado'
        }
      };

      const personalities = {
        natural: { title: 'Expressão natural', note: 'lavanda' },
        contemporanea: { title: 'Expressão contemporânea', note: 'cardamomo' },
        classica: { title: 'Expressão clássica', note: 'neroli' },
        criativa: { title: 'Expressão criativa', note: 'figo' }
      };

      const segments = {
        saude: 'clínicas e espaços de saúde',
        varejo: 'lojas e showrooms',
        corporativo: 'hotéis e ambientes corporativos',
        evento: 'eventos e celebrações'
      };

      const environments = {
        claro: 'claro e minimalista',
        quente: 'quente e aconchegante',
        escuro: 'escuro e sofisticado',
        vibrante: 'colorido e vibrante'
      };

      const intensities = {
        suave: 'Suave e delicada',
        equilibrada: 'Equilibrada e contínua',
        marcante: 'Marcante e envolvente'
      };

      const showStep = (index) => {
        currentStep = index;
        steps.forEach((step, stepIndex) => {
          step.hidden = stepIndex !== currentStep;
        });
        const activeStep = steps[currentStep];
        const activeKey = activeStep.dataset.key;
        progress.setAttribute('aria-valuenow', String(currentStep + 1));
        progressLabel.textContent = `Etapa ${currentStep + 1} de ${steps.length}`;
        progressFill.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
        backButton.hidden = currentStep === 0;
        nextButton.textContent = currentStep === steps.length - 1 ? 'Ver resultado' : 'Continuar';
        nextButton.disabled = !answers[activeKey];
        stepLabel.textContent = answers[activeKey] ? 'Opção selecionada' : 'Escolha uma opção para continuar';
      };

      steps.forEach((step) => {
        const key = step.dataset.key;
        step.querySelectorAll('.ac-quiz-option').forEach((option) => {
          option.addEventListener('click', () => {
            answers[key] = option.dataset.value;
            step.querySelectorAll('.ac-quiz-option').forEach((peer) => {
              const selected = peer === option;
              peer.classList.toggle('is-selected', selected);
              peer.setAttribute('aria-pressed', String(selected));
            });
            nextButton.disabled = false;
            stepLabel.textContent = 'Opção selecionada';
          });
        });
      });

      const showResult = () => {
        const profile = profiles[answers.feeling];
        const personality = personalities[answers.personality];
        const notes = [...profile.notes];
        if (!notes.includes(personality.note)) notes.push(personality.note);

        quiz.querySelector('[data-ac-result-title]').textContent = `${personality.title} de ${profile.name}`;
        quiz.querySelector('[data-ac-result-description]').textContent = `Para ${segments[answers.segment]}, esta direção combina ${profile.summary}, em sintonia com um ambiente ${environments[answers.environment]}.`;
        quiz.querySelector('[data-ac-result-family]').textContent = profile.family;
        quiz.querySelector('[data-ac-result-notes]').textContent = notes.join(', ');
        quiz.querySelector('[data-ac-result-intensity]').textContent = intensities[answers.intensity];
        profile.palette.forEach((color, index) => {
          const swatch = quiz.querySelector(`[data-ac-swatch="${index}"]`);
          swatch.style.background = color;
          swatch.setAttribute('aria-label', color);
        });

        form.hidden = true;
        progress.hidden = true;
        result.hidden = false;
      };

      nextButton.addEventListener('click', () => {
        if (nextButton.disabled) return;
        if (currentStep === steps.length - 1) {
          showResult();
          return;
        }
        showStep(currentStep + 1);
      });

      backButton.addEventListener('click', () => {
        if (currentStep > 0) showStep(currentStep - 1);
      });

      restartButton.addEventListener('click', () => {
        Object.keys(answers).forEach((key) => delete answers[key]);
        quiz.querySelectorAll('.ac-quiz-option').forEach((option) => {
          option.classList.remove('is-selected');
          option.setAttribute('aria-pressed', 'false');
        });
        result.hidden = true;
        form.hidden = false;
        progress.hidden = false;
        showStep(0);
      });

      showStep(0);
    }
  })();
