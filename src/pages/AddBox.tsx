import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { useData } from "@/context/DataContext";
import BoxForm from "@/components/BoxForm";

export default function AddBox() {
  const { addBox } = useData();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15">
          <Package className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-100">New Box</h1>
          <p className="text-sm text-zinc-500">Create a new packing box</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-card p-6">
        <BoxForm
          onSubmit={(values) => {
            addBox(values);
            navigate("/");
          }}
          onCancel={() => navigate("/")}
        />
      </div>
    </div>
  );
}
