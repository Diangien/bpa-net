// "use client";

// import "@/styles/pay-types.css";
// import { useEffect, useState } from "react";
// import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, Input, ModalFooter, Button } from "@nextui-org/react";
// import ServicesList from "../lists/servicesList";
// import useAccountStore from "@/contexts/contaStore";
// import api from "@/utils/axios";
// import useClientStore from "@/contexts/userStore";
// import { toast } from "sonner";
// import { TailSpin } from "react-loader-spinner";

// interface SubProduct {
// 	id: number;
// 	name: string;
// 	price?: number;
//   }
  
//   interface Product {
// 	id: number;
// 	name: string;
// 	reference: [string],
// 	referenceLenght: 0,
// 	subProducts: SubProduct[];
//   }
  
//   interface Entity {
// 	entity_id: number;
// 	reference: string;
// 	name: string;
// 	balance: number;
// 	account_id: number;
// 	description: string;
// 	products: Product[];
// 	logo: string;
//   }

// export default function PayServices() {
	
// 	const [entity, setEntity] = useState<Entity>({account_id: 0, balance: 0, description: "", entity_id: 0, logo: "", name: "", products: [], reference: ""})
// 	const [product, setProduct] = useState<number>(0)
// 	const [subProduct, setSubProduct] = useState<number>(0)
// 	const [reference, setReference] = useState<string[]>([])
//     const [loading, setLoading] = useState(false)
// 	const { isOpen, onOpen, onClose } = useDisclosure();
// 	const useClient = useClientStore()
// 	const { isOpen: isOpen2FA, onOpen: onOpen2FA, onClose: onClose2FA } = useDisclosure();
// 	const useAccount = useAccountStore()
// 	useEffect(() => {
// 		const btns = document.querySelectorAll(
// 			".btnService",
// 		) as NodeListOf<HTMLLIElement>;

// 		function setActive(btn: HTMLLIElement) {
// 			// biome-ignore lint/complexity/noForEach: <explanation>
// 			btns.forEach((btn) => {
// 				btn.dataset.active = "false";
// 			});
// 			btn.dataset.active = "true";
// 		}

// 		// biome-ignore lint/complexity/noForEach: <explanation>
// 		btns.forEach((btn) => {
// 			btn.addEventListener("click", () => {
// 				setActive(btn);
// 			});
// 		});
// 	}, []);

// 	useEffect(()=>{
// 		setProduct(0)
// 		setSubProduct(0)
// 		setReference([])
// 	}, [entity])

// 	function getDataAtual() {
// 		const data = new Date();
// 		const dia = String(data.getDate()).padStart(2, '0');
// 		const mes = String(data.getMonth() + 1).padStart(2, '0');
// 		const ano = data.getFullYear();
// 		return `${dia}/${mes}/${ano}`;
// 	}

// 	async  function submitForm2FA(data: {otp: string}) {
// 		setLoading(true)
//         const response = await api.get(`/check2FA/${data.otp}/${useClient.biNumber}`)
//         if (response.data.valid) {
// 			let body = {
// 				entityReference: 0, 
// 				balance: 0,
// 				clientReferences: {
// 				  phone: 0,
// 				  reference: 0
// 				},
// 				product: "",
// 				package: "",
// 				accountNumber: ""
// 			}
// 			switch(entity.reference) {
// 				case "645001": 
//         		case "643002":
//         		case "673003": {
// 					body = {
// 						entityReference: parseInt(entity.reference), 
// 						balance: (entity.products[product].subProducts[subProduct].price || 0),
// 						clientReferences: {
// 						  phone: parseInt(reference[0]),
// 						  reference: 0
// 						},
// 						product: entity.products[product].name,
// 						package: entity.products[product].subProducts[subProduct].name,
// 						accountNumber: useAccount.number
// 					}
// 					const respons = await api.post('/pay', body)
// 					if (respons.data.success) {
// 						toast.success(respons.data.message)
// 						useAccount.updateAuthorizedBalance(respons.data.balances.authorized_balance)
// 						useAccount.updateAvailableBalance(respons.data.balances.available_balance)
// 						useAccount.updateUpBalance(respons.data.balances.up_balance)
// 						onClose2FA()
// 						onClose()
// 					}
// 					else {
// 						toast.error(respons.data.message)
// 					}
// 					setLoading(false)
// 					break;
// 				}
// 				case "691001": 
//         		case "691002": {
// 					body = {
// 						entityReference: parseInt(entity.reference), 
// 						balance: parseInt(reference[1]),
// 						clientReferences: {
// 						  phone: 0,
// 						  reference: parseInt(reference[0])
// 						},
// 						product: entity.products[product].name,
// 						package: "",
// 						accountNumber: useAccount.number
// 					}
// 					const respons = await api.post('/pay', body)
// 					if (respons.data.success) {
// 						toast.success(response.data.message)
// 						useAccount.updateAuthorizedBalance(respons.data.balances.authorized_balance)
// 						useAccount.updateAvailableBalance(respons.data.balances.available_balance)
// 						useAccount.updateUpBalance(respons.data.balances.up_balance)
// 						onClose2FA()
// 						onClose()
// 					}
// 					else {
// 						toast.error(response.data.message)
// 					}
// 					setLoading(false)
// 					break;
// 				}
// 				default : {
// 					break;
// 				}
// 			}
//             // const resp = await api.get(`/setEmail/${newEmail}/${biNumber}`)
//             // if (resp.status === 201) {
//             //     toast.success("Endereço de email alterado com sucesso!")
//             //     onClose2FA()
//             // }
//             // else {
//             //     toast.error("Sem conexão com o servidor!")
//             //     onClose2FA()
//             // }
//         }
//         else {
//             toast.error("Código de verificação inválido!")
//         }
//     }

// 	return (
// 		<div className="pt1_container">
// 			<div className="top">
// 				<h1>Pagamentos de serviços</h1>
// 				<div className="separator" />
// 			</div>
// 			<div className="bottom">
// 				<div className="left">
// 					<h1>Selecione o serviço</h1>
// 					<ul className="services">
// 						<ServicesList setEntity={setEntity}/>
// 					</ul>
// 				</div>
// 				<div className="wallet rigth">
// 					{entity.entity_id === 0 ? (
// 						<>Selecione o serviço</>
// 					) : (
// 						<>
// 						<form style={{width: "100%"}} onSubmit={async (event)=>{
// 								event.preventDefault()
// 								const formData = new FormData(event.target as HTMLFormElement);
// 								for (let [key, value] of formData.entries()) {
// 									setReference(prevState => [...prevState, value as string]);
// 								}
// 								onOpen()
// 							}}>
// 							<div className="input_field">
// 								<label htmlFor="email">Conta emissora</label>
// 								<input
// 									type="text"
// 									disabled
// 									value={useAccount.number.replaceAll('.', ' ')}
// 								/>
// 							</div>
// 							<div className="input_field">
// 								<label htmlFor="email">Produto</label>
// 								<select className="selectInput" onChange={(event)=>setProduct(parseInt(event.target.value))}>
// 									{entity.products.map((product) => (
//                                         <option key={product.id} value={entity.products.indexOf(product)}>
//                                             {product.name}
//                                         </option>
//                                     ))}
// 								</select>					
// 							</div>
// 							<div className="input_field">
// 								{entity.products[product]?.subProducts?.length > 0 ? 
// 									<><label htmlFor="email">Pacote</label>
// 									<select className="selectInput" onChange={(event)=>setSubProduct(parseInt(event.target.value))}>
// 										{entity.products[product].subProducts.map((productt) => (
// 											<option key={productt.id} value={entity.products[product].subProducts.indexOf(productt)}>
// 												{productt.name}
// 											</option>
// 										))}
// 									</select></>
// 									:
// 									null
// 								}
// 							</div>
// 							{entity.products[product]?.subProducts[subProduct]?.price ? 
// 								(<div className="input_field">
// 									<label htmlFor="email">Preço</label>
// 									<input
// 										type="text"
// 										disabled
// 										value={entity.products[product].subProducts[subProduct].price?.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 2 })}
// 									/>
// 								</div>)
// 									:
// 									null}

// 							{entity.products[product]?.reference?.map((ref)=> (
// 								<div key={ref} className="input_field">
// 									<label htmlFor={ref}>{ref}</label>
// 									<input
// 										type="number"
// 										placeholder={ref}
// 										maxLength={entity.products[product].referenceLenght}
// 										name={ref}
// 										required
// 										pattern="[0-9]*" onInput={(event)=>{
// 											event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
// 										}}
// 									/>
// 								</div>
// 							))}
// 							<button type="submit" style={{padding: "10px 20px", backgroundColor: "var(--color-focus3)", color: "var(--color-focus)", display: "flex", gap: "10px", alignItems: "center", justifyContent: "center", borderRadius: "7px"}}>
// 								Efecutar pagamento 
// 							</button>
								
// 							</form>
// 						</>
// 					)}
// 				</div>
// 			</div>
// 			{isOpen && (
// 				<Modal isOpen={isOpen} onClose={()=>{onClose()}} placement="top-center">
// 					<ModalContent>
// 						<ModalHeader className="flex flex-col gap-1">Pagamento de serviço especial</ModalHeader>
// 						<ModalBody>
// 							<Input
// 								label="Entidade"
// 								type="text"
// 								variant="flat"
// 								value={entity.description}
// 								disabled
// 							/>
// 							<Input
// 								label="Referência"
// 								type="text"
// 								variant="flat"
// 								value={entity.reference} 
// 								disabled
// 							/>
// 							<Input
// 								label="Produto"
// 								type="text"
// 								variant="flat"
// 								value={entity.products[product].name}
// 								disabled
// 							/>
// 							{entity.products[product]?.subProducts[subProduct]?.name && 	
// 							<Input
// 								label="Pacote"
// 								type="text"
// 								variant="flat"
// 								value={entity.products[product].subProducts[subProduct].name}
// 								disabled
// 							/>}	
// 							{entity.products[product]?.subProducts[subProduct]?.price  && 
// 							<Input
// 								label="Preço"
// 								type="text"
// 								variant="flat"
// 								value={entity.products[product].subProducts[subProduct].price?.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 2 })}
// 								disabled
// 							/>}
// 							{entity.products[product].reference.map((ref, index)=>(
// 								<Input
// 									key={ref}
// 									label={ref}
// 									type="text"
// 									variant="flat"
// 									value={reference[index]}
// 									disabled
// 								/>
// 							))}					
// 						</ModalBody>
// 						<ModalFooter>
// 							<Button color="danger" variant="flat" onPress={()=>{onClose()}}>
// 								Cancelar
// 							</Button>
// 							<Button color="success" variant="flat" onPress={async()=>{
// 									try {
// 										setLoading(true)
// 										const resp = await api.post(`/sendOTP/${useClient.email}/${useClient.biNumber}`)
// 										if (resp.status === 201) {
// 											toast.success("Código de autenticação enviado!")
// 											onOpen2FA()
// 											setLoading(false)
// 										}
// 										else {
// 											toast.error(resp.data.message)
// 											setLoading(false)
// 										}

// 									}
// 									catch {
// 										toast.error("Sem conexão com o servidor!")
// 										setLoading(false)
// 									}
// 								}}>
// 								{loading ? (
// 										<TailSpin
// 										height="25"
// 										width="25"
// 										color="#0f0"
// 										ariaLabel="tail-spin-loading"
// 										radius="1"
// 										visible={true}
// 										/>
// 									) : (
// 										'Confirmar'
// 									)}
// 							</Button>
// 						</ModalFooter>
// 					</ModalContent>
// 				</Modal>
// 			)}
			
// 		</div>
// 	);
// }
