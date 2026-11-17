import Mock from "../../components/Mock";

export const metadata = { title: "Mock exam · CIS 1600 Midterm 2" };

export default function Page() {
  return (
    <div className="wrap">
      <div className="page-head">
        <div>
          <h1>Mock exam</h1>
          <p>A full practice sitting. Keep paper and a pen next to you, and don't look anything up.</p>
        </div>
      </div>
      <Mock />
    </div>
  );
}
