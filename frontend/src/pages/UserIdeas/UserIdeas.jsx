/* eslint-disable camelcase */
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sanitize } from "isomorphic-dompurify";
import "./UserIdeas.scss";
import AuthContext from "../../contexts/AuthContext";
import CompanyContext from "../../contexts/CompanyContext";
import PageHeader from "../../components/PageHeader/PageHeader";
import IdeaCard from "../../components/IdeaCard/IdeaCard";
import NavBar from "../../components/NavBar/NavBar";
import Connection from "../../components/Connection/Connection";
import DataSearchBar from "../../components/DataSearchBar/DataSearchBar";
import NewIdeaModal from "../../components/NewIdeaModal/NewIdeaModal";
import { useFetchUserIdeas } from "../../hooks/useFetchUserIdeas";
import ModifiedIdeaModal from "../../components/ModifiedIdeaModal/ModifiedIdeaModal";

export default function UserIdeas() {
  const { userToken, userInfos } = useContext(AuthContext);
  const { setCompanyInfos, companyInfos } = useContext(CompanyContext);
  const { company_slug } = useParams();
  const [dataIdea, setDataIdea] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTermIdea, setSearchTermIdea] = useState("");
  const [isNewIdeaModalOpen, setIsNewIdeaModalOpen] = useState(false);
  const [isModifiedIdeaModalOpen, setIsModifiedIdeaModalOpen] = useState(false);
  const [currentIdea, setCurrentIdea] = useState(null);

  const { fetchUserIdeas } = useFetchUserIdeas();

  const fetchDataIdea = useCallback(() => {
    fetchUserIdeas({
      companyId: companyInfos.id,
      userId: userInfos.id,
      onSuccess(response) {
        setDataIdea(response.data);
        setIsLoading(false);
      },
      onFailure(error) {
        console.error("Error fetching ideas:", error);
      },
    });
  }, [companyInfos, userInfos]);

  useEffect(() => {
    setCompanyInfos((prevCompanyInfos) => ({
      ...prevCompanyInfos,
      slug: sanitize(company_slug),
    }));
  }, [company_slug, setCompanyInfos]);

  let userCompaniesArray = [];
  if (userToken && Object.keys(userInfos).length) {
    if (userInfos.companies) {
      userCompaniesArray = userInfos.companies.split(",");
    }
  }

  useEffect(() => {
    if (companyInfos.id && userInfos.id) {
      fetchDataIdea();
    }
  }, [companyInfos.id, userInfos.id, userToken]);

  return (
    <div>
      {userToken &&
      Object.keys(userInfos).length &&
      (userCompaniesArray.includes(companyInfos.id.toString()) ||
        userInfos.is_salesforce_admin) ? (
        <main>
          <NavBar activeLink="ideas" />
          <PageHeader
            title="Mes idées"
            subtitle="Voici l'ensemble des idées que vous avez créées, souhaitez-vous en ajouter une autre?"
          >
            <button
              className="button-primary-solid"
              type="button"
              onClick={() => {
                setIsNewIdeaModalOpen(true);
              }}
            >
              <i className="fi fi-rr-plus" />
              Ajouter une idée
            </button>
          </PageHeader>
          <div className="page-actions">
            <DataSearchBar
              searchTerm={searchTermIdea}
              setSearchTerm={setSearchTermIdea}
              placeholderText="Rechercher une idée"
            />
          </div>
          <div className="idea-cards-list">
            {!isLoading &&
              dataIdea
                .filter((value) => {
                  if (searchTermIdea === "") {
                    return true;
                  }
                  if (
                    value.title
                      .toLowerCase()
                      .includes(searchTermIdea.toLowerCase()) ||
                    value.description
                      .toLowerCase()
                      .includes(searchTermIdea.toLowerCase()) ||
                    value.creator_firstname
                      .toLowerCase()
                      .includes(searchTermIdea.toLowerCase()) ||
                    value.creator_lastname
                      .toLowerCase()
                      .includes(searchTermIdea.toLowerCase())
                  ) {
                    return true;
                  }
                  return false;
                })
                .map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onDelete={fetchDataIdea}
                    onShowMenu={() => {
                      setCurrentIdea(idea);
                    }}
                    setIsModifiedIdeaModalOpen={setIsModifiedIdeaModalOpen}
                  />
                ))}
          </div>
          {isNewIdeaModalOpen && (
            <NewIdeaModal
              isNewIdeaModalOpen={isNewIdeaModalOpen}
              setIsNewIdeaModalOpen={setIsNewIdeaModalOpen}
              onAdd={fetchDataIdea}
            />
          )}
        </main>
      ) : (
        <Connection />
      )}
      {isModifiedIdeaModalOpen && (
        <ModifiedIdeaModal
          setIsModifiedIdeaModalOpen={setIsModifiedIdeaModalOpen}
          currentIdea={currentIdea}
          onEdit={fetchDataIdea}
        />
      )}
    </div>
  );
}

UserIdeas.defaultProps = {
  pagePart: "ideas",
};
