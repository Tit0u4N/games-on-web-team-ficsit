import React from "react";

type InventoryCaseProps = {
    key: number;
    item?: any;
    className?: string;
}

export const InventoryCase : React.FC<InventoryCaseProps> = ({key, item, className = ''}) => {

    const isEmpty : boolean = !item;
    className = 'p-[8px] aspect-square w-full rounded-xl bg-case ' + className;
    return (
        <div key={key} className={className}>
            {
                isEmpty ?
                    null
                    : <img
                        src={item.image}
                        alt={item.name}
                        className='size-full object-cover'
                    />
            }

        </div>
    );


}