const SwotAnalysisLayout = ({
    children
}:{
    children : React.ReactNode
})=>{
    return (
        <div>
            <div className=" md:pl-50 flex items-center justify-center bg-lime-500" >
                <div className="text-5xl text-sky-950 h-full drop-shadow-md">
                    SWOT ANALYSIS
                </div>
            </div>
            <div className="text-sm text-slate-500 text-center">
                    To analyse your strength in specify role
            </div>
            <div className="md:pl-56 pt-[80px] h-full">
                {children}
            </div>
        </div>
    )
}

export default SwotAnalysisLayout;