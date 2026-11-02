export const research = [
 {
  n:'01', title:'Representation Geometry of LLMs',
  kind:'ONGOING RESEARCH', credit:'Supervised by Dr. Muhammad Tahir',
  text:'We are currently working on an analytical framework to better understand hidden representations of transformer-based LLMs.',
  tags:'LLM representations · Ongoing work', figure:'geometry'
 },
 {
  n:'02', title:'Memorization-Aware Reward Shaping', kind:'STIM4RM / REWARDMAXXING',
  credit:'GRPO research prototype built on STIM',
  text:'I led development of an OLMo-7B prototype combining VersaPRM reasoning-step rewards with STIM token-level memorization penalties. The aim was to discourage memorized shortcuts in mathematical reasoning. I built a custom Hugging Face TRL trainer and cached Infini-gram queries to connect model predictions with pretraining-corpus frequencies when constructing the reward.',
  tags:'Reward design · LLM reasoning', url:'https://github.com/MuhammadBinTariq/STIM4RM', figure:'reward'
 }
];

export const projects = [
 {
  n:'03', title:'Methylation in Arabidopsis lncRNAs', kind:'BIG DATA ANALYTICS',
  credit:'With Muhammad Muneeb Pervez and Umar Habib',
  text:'We investigated how DNA methylation in long non-coding RNAs differs from protein-coding genes, and how it relates to transposable-element (TE) overlap. Our Python/Bash pipeline integrated genomic annotations with BEDTools and profiled CG, CHG, and CHH methylation across 11,071 lncRNA loci and 927 Arabidopsis accessions. Most loci were unmethylated; 23.5% overlapped TEs, and TE overlap was strongly associated with TE-like methylation. We also examined how methylation states were conserved across accessions.',
  tags:'Computational biology · Epigenomics · Data pipelines',
  url:'https://github.com/MuhammadBinTariq/BDA-Codebase', figure:'biology'
 },
 {
  n:'04', title:'Grokking and reverse engineering', kind:'LEARNING DYNAMICS',
  credit:'Collaborative ATML work',
  text:'We reproduced delayed generalisation in a one-layer Transformer and traced the transition from memorisation to a frequency-based solution on modular arithmetic. Ablating four identified components reduced test accuracy from 100% to 12.7%, connecting a change in behaviour to the structure of the learned computation.',
  tags:'Mechanistic interpretability · Generalisation',
  url:'https://github.com/Raahim58/ATML', figure:'grokking'
 },
 {
  n:'05', title:'Learning from preferences and verifiable rewards', kind:'PPO / DPO / GRPO / RLVR',
  credit:'Individual project · Muhammad Bin Tariq',
  text:'I implemented reward modelling, SFT, and policy optimisation to examine how different alignment signals shape learning. GRPO reached a 56% reward-model win rate against SFT in a 50-prompt pilot. GSM8K RLVR exposed a different limitation: most rollout groups had identical rewards, leaving little relative learning signal.',
  tags:'Post-training · Alignment',
  url:'https://github.com/MuhammadBinTariq/vision-language-and-alignment/tree/main/alignment', figure:'alignment'
 },
 {
  n:'06', title:'Continuous connectors and discrete visual tokens', kind:'VISION–LANGUAGE MODELS',
  credit:'CLIP–MLP and VQ-VAE experiments',
  text:'I explored two ways to introduce visual information into SmolLM2. In the continuous model, further tuning reduced the modality gap without improving VQA accuracy. The discrete model answered synthetic visual questions accurately, yet generated images lacked class-specific structure. These results separated representation diagnostics from the capabilities I wanted to understand.',
  tags:'Multimodal learning · Representation analysis',
  url:'https://github.com/MuhammadBinTariq/vision-language-and-alignment/tree/main/vlm', figure:'vision'
 },
 {
  n:'07', title:'Curriculum learning for autonomous driving', kind:'REINFORCEMENT LEARNING',
  credit:'Collaborative project',
  text:'I implemented HighwayEnv benchmarks comparing PPO and DQN across a four-stage curriculum, and contributed to PPO formulation and driving simulations. Our experiments exposed reward exploitation and forgetting during curriculum transitions—cases where progress on the training objective did not preserve earlier skills.',
  tags:'Curriculum learning · Transfer',
  url:'https://github.com/MuhammadBinTariq/DPRL_AutoNav', figure:'driving'
 },
 {
  n:'08', title:'Model biases, generalisation, and training constraints', kind:'ADVANCED TOPICS IN MACHINE LEARNING',
  credit:'With Raahim A. Samad and Muhammad Sabeer Asad',
  text:'Our shared ATML work examines model biases, domain adaptation and generalisation, compression, and federated learning. Across implementations and controlled comparisons, we studied how architectural assumptions and training conditions change the features models rely on and the failures that appear beyond the training distribution.',
  tags:'Collaborative coursework · Empirical analysis',
  url:'https://github.com/Raahim58/ATML', figure:'geometry'
 }
];
