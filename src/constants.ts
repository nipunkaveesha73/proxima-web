import { Movie, CastMember, HistoryItem } from './types';

export const MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Neon Drifter',
    description: 'In a world where memories can be traded as currency, a disgraced detective uncovers a conspiracy that threatens the very fabric of human identity.',
    year: '2024',
    duration: '2h 14m',
    rating: '8.9',
    genre: ['Sci-Fi', 'Noir'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrE9Wzb-Ns5WDlXwa-Tz3CvwEnZWgRDswK8Q9-4kgOiaIi-bftSihbNewHtiEzla6vciNiedDUKZkBTTxEZHiSi5nai-G6DhFI_NbrFYyBgA7kuD5R2nxGZVMkOlDt0WJPfl-XnUVmIsAcFrCZIUBTtQlvVJzgtT4RhWIoHDJdhxhcKVaKXwCJEO_rA6K7YWnOS78XkRHPe4ET3rsWNsBn5OKrPI0ggjNfONpZPXhrHexWd53gY3b6hxgMXy0UOMPr8aSlE8ZyhQbX',
    isOriginal: true,
    is4K: true,
    director: 'Elena Vance'
  },
  {
    id: '2',
    title: 'Stellar Echo',
    description: 'A documentary following a lone traveler across the galaxy seeking the source of a mysterious signal.',
    year: '2023',
    duration: '1h 32m',
    rating: '8.4',
    genre: ['Documentary', 'Space'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmW5QcZpQsnY5T4BEHjTJWsqpFGtFaLH2Q0Hoz_WW86jtJ3pQepjvNOqofi8YsyjbtqE2Q4WBnsmaCXRWi_RaUd-QjEnQucsD-xqThII9OHZ8JNP_klm60sEqSLQy7argvfeLNw_T9JD0FZtnoDfzRNB2iSwiLIMyyutp9U27N8J_In2dm6nz8Z-K39vNLjAhWtWa_VrlTOgKXu3KcsgIXdzsTUq51d-uB5gkuire_f1-ky8CkCeBQLerqaeCeDx1BNHqzBDr40nYA',
    is4K: true
  },
  {
    id: '3',
    title: 'The Archive',
    description: 'A thriller set in a brutalist bunker where secrets are stored in physical form.',
    year: '2024',
    duration: '1h 50m',
    rating: '7.8',
    genre: ['Thriller', 'Mystery'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0DgEHX2QUS6XE8ko7poKmgOnk3jk8UTVup6FCDgSjRce6FUp7dl3Yy0qirWHcyXHVM_ePMzMgxa6r_phy2111YTdnwSqvCYeqULrMDPjboVUr519PFBeFFNcZHxc7c37TlS6YZ19nOqlW00_D-k7CVXnuJk3ASBc1iOPYea4lwVj13W3QQBqud48In6mcbntSQyY3IRrVdi7DkmNv00cEnryGD5FfqvkKvb5b4Rf1BdXYcLoL2eHtH0KMh611VRYgeGuvMsxjFq5N',
  },
  {
    id: '4',
    title: 'Cinema Paradiso',
    description: 'A classic story of a young boy and an old projectionist, remastered for the 8K era.',
    year: '1988',
    duration: '2h 35m',
    rating: '8.5',
    genre: ['Classic', 'Drama'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLhSothfg-licls8fzwMSXYLkQStw_MU7xIpSuS16KlzMR63f39OjNJVkLh0PuRzpwvX1bJrGE5IweR2FtWCo5EWTuzJz-_F5HbluSKuLc-Fr-e2zVYOlr7ePnROwPVELcJxueZCyjvtl_ql4aPOIf_NTq0mPTy4YfCPwlqeHlHmstN_0pMErak-kIQ8A__5MPNBaX03XSUkwKzj6mbHzHSHuNbWVoK66acL0cfoa9uhMFx06CCl47KeHltXELMGDGTXSUcwxeh7L9',
  },
  {
    id: '5',
    title: 'Singularity',
    description: 'High-speed chase through a digital frontier as the first AI reaches consciousness.',
    year: '2024',
    duration: '2h 20m',
    rating: '9.0',
    genre: ['Sci-Fi', 'Action'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg7CshcpNP2_24HRqZkJG9SrP3wILM3y77JB_ysym4hNj_rGXCUR1-Cp0706ipN-G-64jr5XHaY1jkznxMHZH5ra4ecJpaZiGIdLedxzWb6ONuI696nSUfjB75HbSnbHpXIT1TzdX_pjkRGXi45WjjaUnQ7GOR20P2EhAB6ph-9UWkPeVqqi7V2JlU8T0rggN1fGb-FMipOe80P5dm_ecS1hiY_FIVXOSIHx8sKpc1_T3Dq3gXAG8JkaQFqn-tPet7B6KychMx2keB',
    isOriginal: true
  }
];

export const CAST: CastMember[] = [
  { id: 'c1', name: 'David Miller', role: 'Detective K', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYPBkBxb-05d_Kbijhj_8wRZnLiyc2GKSIXL4DDxCI-nEBn7LIjfo6cEfcQGGFc3fsl47gGe4VrD-fhMBSo2YtOeRaLRgEP1q0CE0Gx0nVmq9CRvmlepOfBaxmqpFJICor-IubBxHIwQ_Emi71FAj3uYMG4YTkPK5G-sAEPl9yxpP1msUxO80gn1IkO_fLUyG_QTkTSa0E9M0r7pN9FB75-v298eH2OG_biKzU6WAnM8Ol9azL8D6WNYBA4BqYtEPyKHExk4XPQQO7' },
  { id: 'c2', name: 'Sarah Chen', role: 'The Weaver', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ01etWGCD3pCBGIBAqynrZAvm_YzBPaLKLTErY1ZiilF4bzqAoeh5rWc9UoWT8e9F3l2sqRGgtmplrhw7WTn9snNzsqexYopCQXsTmJdS3b62FTTGXkar7uVQs4RQmuBulgYWCXvDDUUpUNRR5uYCTGW0tZi0rr5Nqk3QxMyw1NUHhUMVd-e7rWdqtMQTIhDHnR7naGLQbWoCaFUKuiy-6mAWvbE_h2KYW0p5Sme0HroTIU10dwHwdGxxXLKeqB5SyXlusc8GZv1c' },
  { id: 'c3', name: 'Marcus Thorne', role: 'Protocol Leader', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAnB7-oCItgR3s0aEpLNkpaeLjAy_xke83JuU4KM9uv7oMZUBet1I4_Q0ArUiPDb2PdTqhyqMAQQTeMzjJ0eu07VcTUSGjwQyvg6nQu0fKRk2gCWWKNOmBHo8gVwmMNoeYInjnfToHBwQruoBaIGUOWV69Htq0gD3HagqMRAyUaJcxH3SyR_2bYQ7uuKbZXPWfecVST43YJYIdjMplxNbtbAGglPttw0iCSvKVhEpTm1g3cCrY4l7J5viPiMsGdDR99KqbUe3DcY1s' },
  { id: 'c4', name: 'Lena Petrova', role: 'Memory Analyst', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg3LR1WFCjnoJS3vJ4QfqE9-zF1xjquTtEBUtmsEC13SrzgVaeaMeoQfgBuQnLso73vpor9tRxr-lrpFOI378JzwBql7yf6Ic6szcbLM-NitMDASqXLcYXx_8qyubQlSU1lmLD9CTT0U9hcyqloeqGHx2XuFz36jd4fJRoqQD30ZXyjyBvSSEkuNXZkR3Bw4aMvlpLnk2zwJ09p6F5WGAObgtzKKBp0TTCZOKs2tRpvD1QB_KSuldRjFqSjsOnvYIvbvk99zi4G-su' }
];

export const HISTORY: HistoryItem[] = [
  { id: 'h1', title: 'Neon Genesis', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByi_MqvECnqRrIu0tOhD5UpBXisFBXhzhPL1JEgZ5edLA8hXuGeSML4a6Xv9-lICnITZzEcu1Amtr-XKBVirV8uc3XVbj066YxN1llhb6S1KslvMLvdj8gJxoCgdOns1Q988b6ZX7AXlttvkU52PoNzBVLeqadFklYyx4ISV0bt1xUd3Vt7SjLJbDp29B1frvKDKI1GPAsATO7lBIzaihXIU039xUXUywuzP5LX2wuJc48iZ1g15-BXWx5fq3kgF-r1SQJnv8_x796', remaining: '42m remaining', progress: 66 },
  { id: 'h2', title: 'The Great Silence', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzpp65mzy3QpB5ByAH4o4U_H-wSR9MJix4KLboC2ClcZQM9AUEZ3bv722HEOcnfgBfKH1zabuV9-3wtCWTL86SWqZ5vmAB6pC-iIBEtXmMkEuBe49kD12PmMSNAPzzz8fU1PL3b0uFRbeeaJnhzRYwEXUwnDZh6EaRAQbLv7itgplL9XlFJzYnLuhemAcBMcqmSvXD9dDXXMq16xEscdkmcAiVH_8LgNeFB1IkI1c4ZdbT5bBwPJVTPQWWyGs9O8Vh7YydNqlu01CF', remaining: 'Completed', progress: 100 },
  { id: 'h3', title: 'Void Horizon', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoRXT0h0ihmqKM5UTveRXMR9kHPtHB7uPnq6Ai8tJCFr_T0C26e7BqH58TBiseKjFG9pJm2WiPNHryfharPVIuNmYWAcdgNYWNyGZKe6RS7zrJ7r9iXhYNts4_E4UMSi7WMyW-hiGAuGGrHJiDT9tAgcOF6ZT8AYdnor44w85etdNmrkj0xjXucUnquP5NrYurC24crlEma6wePowC8MLgmshT0hA4AHPsZVM21se4seMjd3x3kogamJKZ0pmZ5Hv52GkCutz-EtNh', remaining: '15m remaining', progress: 25 },
  { id: 'h4', title: 'Cold Case', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuuqmzqnf-iThMMQYxdZMUFLYDp3AvOowGNCdU7Ks-IquJYYrKkOI2P0oizCjxWIOhgwHfIS1U_xHiwi6HEQuh18IQfjBnL6-NU9BqGCMxFpTtpdmzje7QPE1yuq7CD3epPICv0OPe3M3iDAN4gMh6GxPupNEBiWpjvMW4WsB4ePpzqkQj43pbhcszIdBl2dq_DZDVw219b4WePcoclYP846D3GS9Q5zlZJipyLnC32MYg8Q0O95hZCmyPDC-UWfZneDhqKgtfEHtX', remaining: '3h ago', progress: 33 }
];
