import React, { Component}  from 'react';

class EpochEncounterTable extends Component{


    renderListItem(){
        const encounterList = [];
        this.props.epochDetails && this.props.epochDetails.forEach( (epd,epid)=>{
            epd.encounters.forEach( (ec,idx)=>{

                encounterList.push(<td key={epid+''+idx}><span className="bg-light-grey rounded px-2 py-1">{'E'+idx}</span></td>)
            });
            
        })
        return encounterList;
    }

    render(){
        return( <table className="table table-responsive-lg border-0 text-center mb-0">
        <thead>
            <tr>
            {
                this.props.epochDetails && this.props.epochDetails.map( (epochData,idx)=>{
                    return <th key={idx} colSpan={epochData.encounters.length}>{ epochData.name ? epochData.name :   'Epoch'+(idx+1)}
                    </th>
                })
            }
            </tr>
        </thead>
        <tbody>
           <tr className="text-black">
           {
               this.renderListItem()
           }
              
           </tr>
        </tbody>
     </table>)
    }

}

export default EpochEncounterTable;