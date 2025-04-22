// "use client";

// //import LateralCard from "@/components/cards/requestCard";
// //import PayList from "@/components/lists/payList";
// import PayDefault from "@/components/pagamentos/pay_default";
// import PayReference from "@/components/pagamentos/pay_reference";
// import PayServices from "@/components/pagamentos/pay_services";
// //import PayState from "@/components/pagamentos/pay_state";
// import useAccountStore from "@/contexts/contaStore";
// import "@/styles/pagamentos.css";
// import { useState } from "react";

// export default function Payments() {
// 	const [selectedPage, setSelectedPage] = useState("0");
// 	const useAccount = useAccountStore()

// 	return (
// 		<div className="payments_container">
// 			<div className="payments_header">
// 				<div className="top">
// 					<h1>Pagamentos</h1>
// 					<p>Pague onde estiver.</p>
// 				</div>
// 				<div className="bottom">
// 					<div>
// 						<h2>Saldo contabilístico</h2>
// 						<p>{useAccount.saldo.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}</p>
// 					</div>
// 					<div>
// 						<h2>Saldo autorizado</h2>
// 						<p>{useAccount.saldo.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}</p>
// 					</div>
// 					<div>
// 						<h2>Selecione o tipo de pagamento</h2>
// 						<select
// 							name="payment_type"
// 							id="payment_type"
// 							onChange={(event) => setSelectedPage(event.target.value)}
// 						>
// 							<option value="Selecione" selected disabled>
// 								Selecione
// 							</option>
// 							<option value="1">Pagamento de serviços</option>
// 							{/* <option value="2">Pagamento ao estado</option> */}
// 							<option value="3">Pagamento por referência</option>
// 						</select>
// 					</div>
// 				</div>
// 			</div>
// 			<div className="payments_body">
// 				{selectedPage === "0" && <PayDefault />}
// 				{selectedPage === "1" && <PayServices />}
// 				{/* {selectedPage === "2" && <PayState number={useAccount.number}/>} */}
// 				{selectedPage === "3" && <PayReference number={useAccount.numeroConta}/>}
// 			</div>
// 			<div className="lateral">
// 				<h1 className="title" style={{margin: "10px 0px 0px 0px"}}>Últimos pagamentos</h1>
// 				<div className="separator" />
// 				<div className="requests">
// 					{/* <PayList accountNumber={useAccount.number}/> */}
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
