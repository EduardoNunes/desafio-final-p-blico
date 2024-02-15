import './total-values.css'

export default function TotalValues({ backGroundColor, iconPaper, titleCharge, valueCharge }) {

    return (
        <div className="container-total-values" style={{ backgroundColor: backGroundColor }}>
            <div className='left'>
                {iconPaper}
            </div>
            <div className='right'>
                <div className='title'>
                    <h3>{titleCharge}</h3>
                </div>
                <div className='value'>
                    <h2>{valueCharge}</h2>
                </div>
            </div>
        </div>
    );
}
