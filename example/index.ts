import render from '../src/ychart-topo';
import { TopoData, } from '../typings/defines';

const eventOption = {
  // 'nodeClick': (event: MouseEvent, data: Node): void => { console.log(event, data); },
  // 'lineClick': (event: MouseEvent, data: Line): void => { console.log(event, data); },
  // 'nodeMouseOver': (event: MouseEvent, data: Node): void => { console.log(event, data); },
  // 'nodeMouseOut': (event: MouseEvent, data: Node): void => { console.log(event, data); },
  // 'lineMouseOver': (event: MouseEvent, data: Line): void => { console.log(event, data); },
  // 'lineMouseOut': (event: MouseEvent, data: Node): void => { console.log(event, data); },
};

const update = render(document.querySelector('#app'), eventOption, (userState?: any) => {
  console.log('updated successfully', userState);
});

const data: TopoData = {
  'nodes':[  
    {  
      'id':'821931823954018304',
      'name':'website',
      'times':1363,
      'type':'SERVER',
      'smallType':null,
      'instances':2,
      'activeInstances':2,
      'elapsedTime':43.46,
      'rpm':12.39,
      'epm':1.35,
      'health':'HEALTHY',
      'totalCount':1363,
      'errorTotalCount':149,
      'crossApp':false
    },
    {  
      'id':'821931823954018304USER',
      'name':'用户',
      'times':0,
      'type':'USER',
      'smallType':null,
      'instances':0,
      'activeInstances':0,
      'elapsedTime':0,
      'rpm':0,
      'epm':0,
      'health':null,
      'totalCount':0,
      'errorTotalCount':0,
      'crossApp':false
    },
    {  
      'id':'jdbc:mysql://172.16.32.98:3306/kepler_management?useUnicode=true&characterEncoding=utf-8&useSSL=false&autoCommit=true',
      'name':'jdbc:mysql://172.16.32.98:3306/kepler_management?useUnicode=true&characterEncoding=utf-8&useSSL=false&autoCommit=true',
      'times':0,
      'type':'DATABASE',
      'smallType':'mysql',
      'instances':0,
      'activeInstances':0,
      'elapsedTime':0,
      'rpm':0,
      'epm':0,
      'health':null,
      'totalCount':0,
      'errorTotalCount':0,
      'crossApp':false
    }
  ],
  'links':[  
    {  
      'source':'821931823954018304USER',
      'target':'821931823954018304',
      'elapsedTime':44.53,
      'rpm':0
    },
    {  
      'source':'821931823954018304',
      'target':'jdbc:mysql://172.16.32.98:3306/kepler_management?useUnicode=true&characterEncoding=utf-8&useSSL=false&autoCommit=true',
      'elapsedTime':1,
      'rpm':0
    }
  ]
};

update(data);

const btnFullscreen = document.querySelector('button#fullscreen');
btnFullscreen.addEventListener('click', () => {
  if (!getFullscreenElement()) {
    launchFullscreen(document.querySelector('svg'));
    update(data, { width: window.screen.availWidth, height: window.screen.availHeight });
  }else {
    exitFullscreen();
    update(data, { width: 800, height: 400 });
  }
});

const btnUpdate = document.querySelector('button#update');
btnUpdate.addEventListener('click', () => {
  data.nodes[0].instances = Math.random() * 10 >> 0;
  update(data);
});

function launchFullscreen(element: any) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullScreen();
  }
}

function exitFullscreen() {
  const document = window.document as any;
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function getFullscreenElement() {
  const document = window.document as any;
  return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
}