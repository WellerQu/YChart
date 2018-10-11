import render from "../src/topo";

const update = render(document.querySelector('#app'), (userState?: any) => {
  console.log('updated successfully', userState);
});

update({a: "Java", symbol: "java.png"});

// setInterval(() => update({a: "Redis", symbol: "redis.png"}), 3000);