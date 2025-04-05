
//TODO: Add a proper maintenance page with a message
export default function Maintenance() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-4xl font-bold mb-4">Maintenance Mode</h1>
        <p className="text-lg text-gray-600">We are currently undergoing maintenance. Please check back later.</p>
        </div>
    );
    }