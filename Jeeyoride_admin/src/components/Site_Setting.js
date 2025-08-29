import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "datatables.net";
import "datatables.net-responsive";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { BASE_URL } from "./config";

function SideSetting() {
  const [recipient, setRecipient] = useState("driver");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [websiteName, setWebsiteName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [rozarpayKey, setRozarpayKey] = useState("");
  const [kmRate, setKmRate] = useState("");
  const [dayAuto, setDayAuto] = useState("");
  const [dayCab, setDayCab] = useState("");
  const [nightAuto, setNightAuto] = useState("");
  const [nightCab, setNightCab] = useState("");
  const [cancelCharges, setCancelCharges] = useState("");
  const [referAmount, setReferAmount] = useState("");
  const [oneWayCharges, setOneWayCharges] = useState("");
  const [offPercent, setOffPercent] = useState("");
  const [nightTime, setNightTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [playstoreLink, setPlaystoreLink] = useState("");
  const [helplineNo, setHelplineNo] = useState("");
  const [license, setLicense] = useState("");
  const [softwareLicense, setSoftwareLicense] = useState("");
  const [help, setHelp] = useState("");
  const [terms, setTerms] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [copyright, setCopyright] = useState("");
  const [userterms, setuserTerms] = useState("");

  // Image file and preview
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleToggle = () => setIsActive(!isActive);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/site_setting`);
        const data = await res.json();

        if (data.length > 0) {
          const settings = data[0];

          setWebsiteName(settings.website_name || "");
          setEmail(settings.email || "");
          setMobileNo(settings.phone || "");
          setRozarpayKey(settings.razorpaykey || "");
          setKmRate(settings.km_rate || "");
          setDayAuto(settings.pickup_Charges_Auto || 0);
          setDayCab(settings.PickUp_Charges_Cab || 0);
          setNightAuto(settings.night_pickup_Charges_Auto || "");
          setNightCab(settings.night_PickUp_Charges_Cab || "");
          setCancelCharges(settings.cancelationCharges || "");
          setReferAmount(settings.reffer_amount || "");
          setOneWayCharges(settings.outercity_oneway_discount || "");
          setOffPercent(settings.off_persent || "");
          setNightTime(settings.start_night_time || "");
          setEndTime(settings.end_night_time || "");
          setPlaystoreLink(settings.playstore_link || "");
          setHelplineNo(settings.help_line_no || "");
          setLicense(settings.licences || "");
          setSoftwareLicense(settings.software_licences || "");
          setHelp(settings.help || "");
          setTerms(settings.terms_condition || "");
          setPrivacy(settings.privacy_policy || "");
          setCopyright(settings.coptright_policy || "");
          setuserTerms(settings.user_terms || "");

          // Image preview from image field (just "image")
          if (settings.image) setImagePreview(settings.image);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("recipient", recipient);
    formData.append("title", title);
    formData.append("message", message);
    formData.append("websiteName", websiteName);
    formData.append("email", email);
    formData.append("mobileNo", mobileNo);
    formData.append("rozarpayKey", rozarpayKey);
    formData.append("kmRate", kmRate);
    formData.append("dayAuto", dayAuto);
    formData.append("dayCab", dayCab);
    formData.append("nightAuto", nightAuto);
    formData.append("nightCab", nightCab);
    formData.append("cancelCharges", cancelCharges);
    formData.append("referAmount", referAmount);
    formData.append("oneWayCharges", oneWayCharges);
    formData.append("offPercent", offPercent);
    formData.append("nightTime", nightTime);
    formData.append("endTime", endTime);
    formData.append("playstoreLink", playstoreLink);
    formData.append("helplineNo", helplineNo);
    formData.append("license", license);
    formData.append("softwareLicense", softwareLicense);
    formData.append("help", help);
    formData.append("terms", terms);
    formData.append("privacy", privacy);
    formData.append("copyright", copyright);
    formData.append("userterms", userterms);

    // Append image file if changed
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch(`${BASE_URL}/site_setting`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResponseMsg(
        res.ok ? "Updated successfully!" : data.error || "Update failed."
      );
    } catch (error) {
      setResponseMsg("Error: " + error.message);
    }
  };

  useEffect(() => {
    if (responseMsg) {
      const timer = setTimeout(() => {
        setResponseMsg("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [responseMsg]);

  return (
    <>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div
        id="page-container"
        className={isActive ? "sidebar-open" : "sidebar-closed"}
      >
        <div className="driver-card-body">
          <div class="headercard">
            <center>
              <h4>Website Setting</h4>
            </center>
          </div>
          <div className="chckout-card">
            <div className="sitesetting">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-row1">
                  <div className="form-group1">
                    <label>Website Name</label>
                    <input
                      type="text"
                      value={websiteName}
                      onChange={(e) => setWebsiteName(e.target.value)}
                    />
                  </div>
                  <div className="form-group1">
                    <label>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row1">
                  <div className="form-group1">
                    <label>Mobile No</label>
                    <input
                      type="number"
                      value={mobileNo}
                      onChange={(e) => setMobileNo(e.target.value)}
                    />
                  </div>
                  <div className="form-group1">
                    <label>Rozarpay Key</label>
                    <input
                      type="text"
                      value={rozarpayKey}
                      onChange={(e) => setRozarpayKey(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row1">
                  <div className="form-group1">
                    <label>Km Rate</label>
                    <input
                      type="text"
                      value={kmRate}
                      onChange={(e) => setKmRate(e.target.value)}
                    />
                  </div>
                  <div className="form-group1">
                    <label>Day Pick Up Charges Auto</label>
                    <input
                      type="text"
                      value={dayAuto}
                      onChange={(e) => setDayAuto(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row1">
                  <div className="form-group1">
                    <label>Day Pick Up Charges Cab</label>
                    <input
                      type="text"
                      value={dayCab}
                      onChange={(e) => setDayCab(e.target.value)}
                    />
                  </div>
                  <div className="form-group1">
                    <label>Night Pick Up Charges Auto</label>
                    <input
                      type="text"
                      value={nightAuto}
                      onChange={(e) => setNightAuto(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row1">
                  <div className="form-group1">
                    <label>Night Pick Up Charges Cab</label>
                    <input
                      type="text"
                      value={nightCab}
                      onChange={(e) => setNightCab(e.target.value)}
                    />
                  </div>
                  <div className="form-group1">
                    <label>Ride Cancellation Charges</label>
                    <input
                      type="text"
                      value={cancelCharges}
                      onChange={(e) => setCancelCharges(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row1">
                  <div className="form-group1">
                    <label>Refer Amount (₹)</label>
                    <input
                      type="text"
                      value={referAmount}
                      onChange={(e) => setReferAmount(e.target.value)}
                    />
                  </div>
                  <div className="form-group1">
                    <label>One Way Sharing Charges</label>
                    <input
                      type="number"
                      value={oneWayCharges}
                      onChange={(e) => setOneWayCharges(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row1">
                  <div className="form-group1">
                    <label>Per Ride OFF %</label>
                    <input
                      type="number"
                      value={offPercent}
                      onChange={(e) => setOffPercent(e.target.value)}
                    />
                  </div>
                  <div className="form-group1">
                    <label>Night Time</label>
                    <input
                      type="time"
                      value={nightTime}
                      onChange={(e) => setNightTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row1">
                  <div className="form-group1">
                    <label>End Time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                  <div className="form-group1">
                    <label>Playstore Link</label>
                    <input
                      type="text"
                      value={playstoreLink}
                      onChange={(e) => setPlaystoreLink(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row1">
                  <div className="form-group1">
                    <label>Help Line No</label>
                    <input
                      type="text"
                      value={helplineNo}
                      onChange={(e) => setHelplineNo(e.target.value)}
                    />
                  </div>
                  <div className="form-group1">
                    <label>Licences</label>
                    <input
                      type="text"
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                    />
                  </div>
                </div>

                {/* <label>Website Name</label>
                <input type="text" value={websiteName} onChange={e => setWebsiteName(e.target.value)} />

                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} /> */}

                {/* <label>Mobile No</label>
                <input type="number" value={mobileNo} onChange={e => setMobileNo(e.target.value)} />

                <label>Rozarpay Key</label>
                <input type="text" value={rozarpayKey} onChange={e => setRozarpayKey(e.target.value)} /> */}

                {/* <label>Km Rate</label>
                <input type="text" value={kmRate} onChange={e => setKmRate(e.target.value)} />

                <label>Day Pick Up Charges Auto</label>
                <input type="text" value={dayAuto} onChange={e => setDayAuto(e.target.value)} /> */}

                {/* <label>Day Pick Up Charges Cab</label>
                <input type="text" value={dayCab} onChange={e => setDayCab(e.target.value)} />

                <label>Night Pick Up Charges Auto</label>
                <input type="text" value={nightAuto} onChange={e => setNightAuto(e.target.value)} /> */}

                {/* <label>Night Pick Up Charges Cab</label>
                <input type="text" value={nightCab} onChange={e => setNightCab(e.target.value)} />

                <label>Ride Cancellation Charges</label>
                <input type="text" value={cancelCharges} onChange={e => setCancelCharges(e.target.value)} /> */}

                {/* <label>Refer Amount (₹)</label>
                <input type="text" value={referAmount} onChange={e => setReferAmount(e.target.value)} />

                <label>One Way Sharing Charges</label>
                <input type="number" value={oneWayCharges} onChange={e => setOneWayCharges(e.target.value)} /> */}

                {/* <label>Per Ride OFF %</label>
                <input type="number" value={offPercent} onChange={e => setOffPercent(e.target.value)} />

                <label>Night Time</label>
                <input type="time" value={nightTime} onChange={e => setNightTime(e.target.value)} /> */}

                {/* <label>End Time</label>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />

                <label>Playstore Link</label>
                <input type="text" value={playstoreLink} onChange={e => setPlaystoreLink(e.target.value)} /> */}

                {/* <label>Help Line No</label>
                <input type="text" value={helplineNo} onChange={e => setHelplineNo(e.target.value)} />

                <label>Licences</label>
                <input type="text" value={license} onChange={e => setLicense(e.target.value)} /> */}

                <label>Software Licences</label>
                <input
                  type="text"
                  value={softwareLicense}
                  onChange={(e) => setSoftwareLicense(e.target.value)}
                />

                <label>Help</label>
                <CKEditor
                  editor={ClassicEditor}
                  data={help}
                  onChange={(e, editor) => setHelp(editor.getData())}
                />

                <label>Driver Terms & Conditions</label>
                <CKEditor
                  editor={ClassicEditor}
                  data={terms}
                  onChange={(e, editor) => setTerms(editor.getData())}
                />

                <label>User Terms & Conditions</label>
                <CKEditor
                  editor={ClassicEditor}
                  data={userterms}
                  onChange={(e, editor) => setuserTerms(editor.getData())}
                />

                <label>Privacy Policy</label>
                <CKEditor
                  editor={ClassicEditor}
                  data={privacy}
                  onChange={(e, editor) => setPrivacy(editor.getData())}
                />

                <label>Copyright Policy</label>
                <CKEditor
                  editor={ClassicEditor}
                  data={copyright}
                  onChange={(e, editor) => setCopyright(editor.getData())}
                />

                {/* Image Upload */}
                <label>Website/Favicon Image</label>
                <input
                  type="file"
                  className="inputfile"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    width={100}
                    height={100}
                    alt="Image Preview"
                  />
                )}

                <div className="row">
                  <button type="submit" className="updatebtn">
                    Update
                  </button>
                  <button type="reset" className="cancalbtn">
                    Cancel
                  </button>
                </div>

                {responseMsg && <p className="text-white">{responseMsg}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideSetting;
