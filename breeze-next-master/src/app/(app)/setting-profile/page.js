
import Profiles from "../../store-or-update-profile/page"
import Setting from "../../user-profile/page"
import '../../../styles/dashboard.css'
export const metadata = {
    title: 'Laravel - Dashboard',
}

const Dashboard = () => {
    return (
        // <div className="py-12">
        //     <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        //         <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        //             {/* <div className="p-6 bg-white border-b border-gray-200 containers" >  */}
        //             <div className="bg-white border-b border-gray-200 containers" >
        //                 <div className="scrollable-content">
                            <Setting />
        //                 </div>
        //                 <div className="like scrollable-content">  <Profiles /></div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}

export default Dashboard
