import { Report } from '../models/report.model';

export const REPORTS_MOCK: Report[] = [
  {
    id: 1,
    author: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'j.doe@mobireport.com',
      birth_date: '1990-01-01',
      sex: 'Homme',
    },
    observations: [
      { id: 1, name: 'Réseau' },
      { id: 2, name: 'Connexion' },
    ],
    description: 'Un soucis sur mon réseau',
  },
  {
    id: 2,
    author: {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@mobireport.com',
      birth_date: '1988-04-15',
      sex: 'Femme',
    },
    observations: [
      { id: 4, name: 'Application' },
      { id: 6, name: 'Performance' },
    ],
    description: "L'application mobile se ferme de façon aléatoire depuis la dernière mise à jour.",
  },
  {
    id: 3,
    author: {
      first_name: 'Alex',
      last_name: 'Martin',
      email: 'alex.martin@mobireport.com',
      birth_date: '1995-11-22',
      sex: 'Non-binaire',
    },
    observations: [{ id: 5, name: 'Sécurité' }],
    description: 'Suspicion de connexion non autorisée sur mon compte professionnel.',
  },
  {
    id: 4,
    author: {
      first_name: 'Camille',
      last_name: 'Bernard',
      email: 'camille.bernard@mobireport.com',
      birth_date: '1982-07-08',
      sex: 'Femme',
    },
    observations: [
      { id: 3, name: 'Matériel' },
      { id: 1, name: 'Réseau' },
    ],
    description: 'Le terminal de paiement coupe régulièrement le réseau en magasin.',
  },
  {
    id: 5,
    author: {
      first_name: 'Hugo',
      last_name: 'Lefevre',
      email: 'hugo.lefevre@mobireport.com',
      birth_date: '1993-03-30',
      sex: 'Homme',
    },
    observations: [{ id: 2, name: 'Connexion' }],
    description: 'Impossible de se connecter au VPN depuis deux jours.',
  },
];
