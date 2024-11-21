import { ReactElement } from "react";

interface List {
    items: ReactElement[];
}

const List = (props: List) => {
    return (
        <div>
            {
                props.items.map((item, index) => (
                    <div key={index}>
                        <div>{item}</div>
                        {index === props.items.length - 1 && <div>divider</div> : null}
                    </div>
                ))
            }
        </div>
    );
}

export default List;