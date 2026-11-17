import { Suspense } from "react";
import PracticeBank from "../../components/PracticeBank";

export const metadata = { title: "Problems · CIS 1600 Midterm 2" };

export default function PracticePage() {
  return (
    <div className="wrap">
      <h1 className="sr-only">Practice problems</h1>
      <Suspense fallback={<p style={{ padding: 40 }}>Loading problems…</p>}>
        <PracticeBank />
      </Suspense>
    </div>
  );
}
