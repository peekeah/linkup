import { IconMessage, IconShieldLock, IconUsers } from "@tabler/icons-react"

const featuresList = [{
    icon: <IconUsers size={18} />,
    title: "Communities",
    description: "Discover and join communities of shared interests. Engage in meaningful group conversations with people who get you."
}, {
    icon: <IconMessage size={18} />,
    title: "Private Chat",
    description: "Real-time one-on-one conversations in a smooth, distraction-free chat experience designed for focus."
}, {
    icon: <IconShieldLock size={18} />,
    title: "Security",
    description: "Your conversations are yours. Strong privacy and security so you can communicate without compromise"
}]
export const Features = () => {
    return (
        <div>
            <div className="text-center space-y-3 mt-42 mb-5">
                <div className="uppercase text-primary tracking-wide">Features</div>
                <div className="text-3xl font-semibold">Everything you need to connect</div>
                <div className="text-gray-500">Built for meaningful conversation, not noise</div>
            </div>

            <div className="my-20 grid grid-cols-1 md:grid-cols-3 gap-10">
                {featuresList.map((feature, index) => (
                    <div key={index} className="bg-accent/50 border border-primary/30 rounded-2xl p-5 space-y-3">
                        <div className="p-2 bg-primary/30 w-fit rounded-xl">{feature.icon}</div>
                        <div className="font-semibold mb-2">{feature.title}</div>
                        <div className="text-sm text-gray-500">{feature.description}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

