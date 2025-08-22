'use client'

import React from 'react'
import type { DragEndEvent } from '@dnd-kit/core'
import {
    closestCenter,
    DndContext,
    PointerSensor,
    useSensor,
} from '@dnd-kit/core'
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Tabs } from 'antd'
import { TabList } from '../page'

interface DraggableTabPaneProps extends React.HTMLAttributes<HTMLDivElement> {
    'data-node-key': string
}

const DraggableTabNode: React.FC<Readonly<DraggableTabPaneProps>> = ({
    className,
    ...props
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({
            id: props['data-node-key'],
        })

    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        cursor: 'move',
    }

    return React.cloneElement(props.children as React.ReactElement<any>, {
        ref: setNodeRef,
        style,
        ...attributes,
        ...listeners,
    })
}
type Props = {
    items: TabList
    setItems: React.Dispatch<React.SetStateAction<TabList>>
    onChange: (newActiveKey: string) => void
    onEdit: (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove'
    ) => void
    activeKey: string
}
export default function WorkbenchTabs({
    items,
    setItems,
    onChange,
    onEdit,
    activeKey,
}: Props) {
    const sensor = useSensor(PointerSensor, {
        activationConstraint: { distance: 10 },
    })

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            setItems((prev) => {
                const activeIndex = prev.findIndex((i) => i.key === active.id)
                const overIndex = prev.findIndex((i) => i.key === over?.id)
                return arrayMove(prev, activeIndex, overIndex)
            })
        }
    }

    return (
        <Tabs
            items={items}
            type="editable-card"
            onChange={onChange}
            activeKey={activeKey}
            onEdit={onEdit}
            renderTabBar={(tabBarProps, DefaultTabBar) => (
                <DndContext
                    sensors={[sensor]}
                    onDragEnd={onDragEnd}
                    collisionDetection={closestCenter}
                >
                    <SortableContext
                        items={items.map((i) => i.key)}
                        strategy={horizontalListSortingStrategy}
                    >
                        <DefaultTabBar {...tabBarProps}>
                            {(node) => (
                                <DraggableTabNode
                                    {...(
                                        node as React.ReactElement<DraggableTabPaneProps>
                                    ).props}
                                    key={node.key}
                                >
                                    {node}
                                </DraggableTabNode>
                            )}
                        </DefaultTabBar>
                    </SortableContext>
                </DndContext>
            )}
        />
    )
}
