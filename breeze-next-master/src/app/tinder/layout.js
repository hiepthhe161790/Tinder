'use client'

const AppLayout = ({ children }) => {


    return (
        <div className="min-h-screen bg-gray-100">


            <main>{children}</main>
        </div>
    )
}

export default AppLayout
