const uploads='/assets/wp-content/uploads/';
const image=(name,source,position='center')=>({src:`/assets/heroes/${name}.webp`,source:`${uploads}${source}`,position});

// Optimized copies of photographs already captured from the original website.
export const heroPhotos={
  workplace:image('workplace','2024/09/pexels-fauxels-3183190.jpg'),
  members:image('members','2024/09/Computer-Resources-T-Limited-6.jpg'),
  community:image('community','2024/09/group-happy-african-volunteers-hugs-park-africa-volunteering-charity-people-ecology-concept.jpg'),
  agriculture:image('agriculture','2024/10/african-people-harvesting-vegetables.jpg','center 44%'),
  workshop:image('workshop','2024/09/medium-shot-men-holding-brushes.jpg'),
  inventory:image('inventory','2024/09/inventor.jpg'),
  vehicle:image('vehicle','2024/09/cartrack.jpg'),
  school:image('school','2024/09/Computer-Resources-T-Limited-4.jpg'),
  training:image('training','2024/09/7.jpg','center 45%'),
  gallery:image('gallery','2024/09/5.jpg','center 40%'),
  consultation:image('consultation','2024/09/const3.jpg'),
  farming:image('farming','2024/10/pixelcut-export.jpeg'),
};

const routes={
  '/':{...heroPhotos.workplace,src:`${uploads}2024/09/pexels-fauxels-3183190.jpg`},
  '/saccos-microfinance-system/':heroPhotos.members,
  '/union-management-system/':heroPhotos.community,
  '/amcos-management-system/':heroPhotos.agriculture,
  '/about-us/':heroPhotos.community,
  '/services/':heroPhotos.workshop,
  '/technology/':heroPhotos.workplace,
  '/software-consultancy-and-service/':heroPhotos.consultation,
  '/contact-us/':heroPhotos.consultation,
  '/request-demo/':heroPhotos.workplace,
  '/implementation-guide/':heroPhotos.workshop,
  '/updates/':heroPhotos.training,
  '/testimonials/':heroPhotos.community,
  '/faq/':heroPhotos.consultation,
  '/inventory-and-accounting-software/':heroPhotos.inventory,
  '/car-tracking-system/':heroPhotos.vehicle,
  '/school-management-system/':heroPhotos.school,
  '/payroll-system/':heroPhotos.workplace,
  '/resources/sacco-system-upgrade-guide/':heroPhotos.members,
  '/resources/sacco-data-migration-guide/':heroPhotos.workplace,
  '/resources/cloud-versus-local-servers/':heroPhotos.workplace,
  '/resources/evaluate-union-amcos-software/':heroPhotos.farming,
  '/resources/prepare-software-demonstration/':heroPhotos.consultation,
  '/training/':{...heroPhotos.training,title:'Training',eyebrow:'Recorded learning & support'},
  '/gallery/':{...heroPhotos.gallery,title:'Gallery',eyebrow:'Our work in action'},
  '/foresight-software-training-seminar/':{...heroPhotos.training,title:'Foresight Software Training Seminar',eyebrow:'Archive · September 2024'},
  '/general-version-release/':{...heroPhotos.workplace,title:'General Version Release',eyebrow:'Archive · September 2024'},
  '/2024/09/12/':{...heroPhotos.training,title:'September 2024 archive',eyebrow:'Historical announcements'},
  '/author/foresight/':{...heroPhotos.gallery,title:'Foresight announcement archive',eyebrow:'Computer Resources (T) Limited'},
  '/category/new-release/':{...heroPhotos.workplace,title:'Release announcement archive',eyebrow:'Historical announcements'},
  '/category/training/':{...heroPhotos.training,title:'Training announcement archive',eyebrow:'Historical announcements'},
};

export const heroForPath=path=>routes[path] || heroPhotos.workplace;
