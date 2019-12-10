import React, { Component}  from 'react';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

class PreviewEncounterTable extends Component{


    renderListItem(){
        const encounterList = [];
        this.props.epochDetails && this.props.epochDetails.map( (epd,epid)=>{
            epd.encounters.map( (ec,idx)=>{
                encounterList.push(<td key={epid+''+idx}>
                <Tooltip
          placement="top"
          mouseEnterDelay={0}
          mouseLeaveDelay={0.1}
          destroyTooltipOnHide={false}
          trigger={Object.keys({hover: 1})}
          onVisibleChange={this.onVisibleChange}
          overlay={<div >{ec.encounterName ? ec.encounterName : 'Encounter'+encounterList.length}</div>}
          align={{
            offset: [0, -3],
          }}
        >
                <span className="bg-light-grey rounded px-2 py-1">{'E'+encounterList.length}</span>
                
                    </Tooltip>
                </td>)
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
                    return <th key={idx} colSpan={epochData.encounters.length}>{ epochData.name ? epochData.name : 'Epoch'+idx}
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
export default PreviewEncounterTable;