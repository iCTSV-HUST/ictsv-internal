<script lang="ts">
  // import Counter from './lib/Counter.svelte'
  type Prize = {
    text: string;
    imgalt?: string;
    img: string;
    number: number;
    percentage: number;
    cumWeight?: number;
  }
  // import { prizesData } from './prizes';
  // console.log(prizesData);



  let prizes: Prize[] = $state(data.data);
  

  const badResults = [
    "Bạn sẽ nhận được một cái bắt tay!",
    "Bạn sẽ nhận được một tràng vỗ tay!",
    "Chúc bạn may mắn lần sau..."
  ]

  function getBadResult() {
    return badResults[Math.floor(Math.random() * badResults.length)];
  }

  let wheel: HTMLUListElement = $state();
  let animation: Animation;
  let previousEndDegree = 0;


  let sumWeight = 0;
  function updateCumWeight() {
    for (let prize of prizes) {
      sumWeight += prize.percentage;
      prize.cumWeight = sumWeight;
      console.log(prize.text,":", Math.round(prize.cumWeight * 100000) / 100000);
    }    
  }
  updateCumWeight();

  console.log(sumWeight);

  let showModal = $state(true);
  let spinDisabled = $state(false);
  let chosenprize: Prize = $state();

  function spinWheel() {
    if (animation) {
      animation.cancel(); // Reset the animation if it already exists
    }
    spinDisabled = true;


    const chosenRandom = Math.random() * sumWeight;
    let chosenIndex = prizes.length - 1;

    console.log(Math.round(chosenRandom * 100000) / 100000);
    for (let i = 0; i < prizes.length; i++) {
      if (chosenRandom < (prizes[i].cumWeight ?? 100)) {
        chosenprize = prizes[i];
        chosenIndex = i;
        break;
      }
    }

    const pieDegree = 360 / prizes.length;

    const additionalRandomDegree =  Math.random() * 0.9 * pieDegree - pieDegree / 2;

    const newEndDegree = (prizes.length - chosenIndex) * pieDegree + additionalRandomDegree + 1800;
    // const newEndDegree = previousEndDegree % 360 + randomAdditionalDegrees;

    animation = wheel.animate([
      { transform: `rotate(${previousEndDegree % 360}deg)` },
      { transform: `rotate(${newEndDegree}deg)` }
    ], {
      duration: 4000,
      direction: 'normal',
      easing: 'cubic-bezier(0.3, -0.3, 0, 1.03)',
      fill: 'forwards',
      iterations: 1
    });

    previousEndDegree = newEndDegree;

    setTimeout(function() {
      showModal = true;
      spinDisabled = false;
      chosenprize.number -= 1;

      // Remove item if 0
      if (chosenprize.number == 0) {
        prizes.splice(chosenIndex, 1);
        updateCumWeight();
        
        prizes = prizes;
        console.log(prizes);
      }
    }, 4300);
  };

  import CocImg from "./images/Coc.png";
  import SnackImg from   "./images/Snack.png";
  import MocImg from   "./images/Moc.png";
  import KeoImg from   "./images/Keo.png";
  import SoImg from   "./images/So.png";
  import OishiImg from   "./images/Oishi.png";
  import BanhStaffImg from   "./images/BanhStaff.png";
  import SateImg from   "./images/Sate.png";
  import missImg from   "./images/miss.png";
  import sadGif from './images/pensive-face.gif'

  const images = {
    "images/Coc.png": CocImg,
    "images/Snack.png": SnackImg,
    "images/Moc.png": MocImg,
    "images/Keo.png": KeoImg,
    "images/So.png": SoImg,
    "images/Oishi.png": OishiImg,
    "images/BanhStaff.png": BanhStaffImg,
    "images/Sate.png": SateImg,
    "images/miss.png": missImg
  };
  import Modal from './Modal.svelte';
  interface Props {
    data: any;
  }

  let { data }: Props = $props();

</script>



<main class="overflow-hidden flex flex-col items-center mt-40">

  <!-- <h1>Vite + Svelte: {chosenprize?.text}</h1> -->
<div class="border-[16px] border-primary rounded-full w-fit  flex justify-center items-center">
  <ul class="grid bg-[#e44025]/75 justify-center items-center wheel-o-fortune" bind:this={wheel}>

    {#each prizes as prize, index}
      <li class="p-2 bg-blue-500 h-[52%] pt-8 flex flex-col items-center"
        style:width={"calc((2 * pi * 19.5rem) / " + prizes.length}
        style:background-color={index % 2 ? "#ffcb3f" : "#ffb820"}
        style:rotate={(360 / prizes.length * index) + "deg"}>
        <span class="font-bold">{prize.text}</span>
        <img src={images[prize.img]} class="w-24 mt-2" alt="prize"/>
      </li>
    {/each}
  </ul>

  <div class="absolute left-0 right-0 flex items-center justify-center transition-all"
    class:graying={spinDisabled}>
    <svg class="absolute" width="7rem" height="7rem" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#e44025" stroke-width="0.00048000000000000007" transform="rotate(0)matrix(1, 0, 0, -1, 0, -12)">
      <g id="SVGRepo_bgCarrier" stroke-width="0"/>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
      <g id="SVGRepo_iconCarrier"> <path d="M0 0h48v48H0z" fill="none"/> <g id="Shopicon"> <path d="M24,44c0,0,14-12,14-26c0-7.732-6.268-14-14-14s-14,6.268-14,14C10,32,24,44,24,44z M24,16c1.105,0,2,0.895,2,2 c0,1.105-0.895,2-2,2c-1.105,0-2-0.895-2-2C22,16.895,22.895,16,24,16z" /> </g> </g>
    </svg>

    <button class="w-16 h-16 rounded-full z-10 bg-[#e44025] text-white font-bold" onclick={spinWheel}
      disabled={spinDisabled}>
      Quay
    </button>  
  </div>
</div>

</main>

<Modal bind:showModal>
  {#if chosenprize?.number > -1}
    <div class="flex justify-center items-center">
      <img src={images[chosenprize?.img]} class="w-60 h-60 object-contain block" alt="prize"/>
    </div>
    <h2 class="text-4xl font-bold text-gray-700 mt-4 mb-2">Chúc mừng!</h2>
    <h3 class="text-xl font-semibold text-gray-600 ">Bạn đã trúng {chosenprize?.text}</h3> 
  {:else}
    <div class="flex justify-center items-center">
      <img src={sadGif} class="w-60 h-60 object-contain" alt="prize"/>  
    </div>
    <h2 class="text-4xl font-bold text-gray-700 mt-4 mb-2">Rất tiếc!</h2>
    <h3 class="text-xl font-semibold text-gray-600 ">{getBadResult()}</h3>     
  {/if}
</Modal>

<style>
  :global(body) {
    background: url("images/bg.png") center/cover;
    height: 100vh;
  }

  .graying {
    filter: grayscale(50%);
  }
  .border-primary {
    border-color: #e44025;
  }

  .wheel-o-fortune {
    clip-path: inset(0 0 0 0 round 50%);
    width: 36rem;
    height: 36rem;
  }

  li {
    translate: 0 -50%;
    transform-origin: bottom center;
    clip-path: polygon(0 1%, 50% 99%, 100% 1%);
    grid-area: 1 / -1;
  }
</style>
