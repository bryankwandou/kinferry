export type Recipient={id:string;name:string;initials:string;country:string;wallet:string;fullWallet:string;verified:boolean;channel:string};
export const recipients:Recipient[]=[
 {id:"maria",name:"Maria Santos",initials:"MS",country:"Philippines",wallet:"ELcx...JzxT7",fullWallet:"ELcxVvxi5yxktxQsySFhbMqyt37PxzJKMhEhiKnJzxT7",verified:true,channel:"Wallet signature confirmed"},
 {id:"adi",name:"Adi Pratama",initials:"AP",country:"Indonesia",wallet:"7LUx...pQ41",fullWallet:"7LUxCNyZBLzjUa13EZEMF5G4fRcpAQ5XMmcFGmcEpQ41",verified:true,channel:"Email confirmed"},
 {id:"lina",name:"Lina Mensah",initials:"LM",country:"Ghana",wallet:"4kDe...x82A",fullWallet:"4kDeZmQoPQUzX64N4ZNgEauJo8RVRKJfVvxxE9mUx82A",verified:false,channel:"Awaiting confirmation"}
];
export const transfers=[{recipient:"Maria Santos",amount:"$180.00",receives:"PHP 10,584",date:"Jul 22, 2026",status:"Settled",tx:"5vGK...8sR"},{recipient:"Adi Pratama",amount:"$250.00",receives:"IDR 4,075,000",date:"Jul 18, 2026",status:"Settled",tx:"3nHY...1cA"},{recipient:"Maria Santos",amount:"$180.00",receives:"PHP 10,512",date:"Jun 22, 2026",status:"Settled",tx:"8dJQ...5mT"}];
