import './line-table.css'

export default function LineTable({ cliente, idDaCob, valor }) {
    return (
        <div className="line-table">
            <div className='cliente' title={cliente}>
                <p>{cliente}</p>
            </div>
            <div className='id-da-cob' title={idDaCob}>
                <p>{idDaCob}</p>
            </div>
            <div className='valor' title={valor}>
                <p>{valor}</p>
            </div>
        </div>
    )
}